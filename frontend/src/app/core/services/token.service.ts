import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../models/auth.model';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;
  role?: string;
  fullName?: string;
  userId?: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly AUTH_API = environment.services.auth;
  private readonly ACCESS_TOKEN_KEY = 'gymlite_access_token';
  private readonly REFRESH_TOKEN_KEY = 'gymlite_refresh_token';

  private readonly authStateSubject = new BehaviorSubject<AuthState>({
    authenticated: false,
    user: null
  });

  readonly authState$ = this.authStateSubject.asObservable();

  private refreshTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.AUTH_API}/authenticate`, { email, password })
      .pipe(
        tap((res) => this.handleAuthResponse(res)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.AUTH_API}/register`, {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
      })
      .pipe(
        tap((res) => this.handleAuthResponse(res)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.stopTokenRefresh();
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.authStateSubject.next({ authenticated: false, user: null });
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      return null;
    }
    return token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.authenticated;
  }

  getCurrentState(): AuthState {
    return this.authStateSubject.value;
  }

  refreshAccessToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) return of(false);

    return this.http
      .post<AuthResponse>(`${this.AUTH_API}/refresh-token`, { refreshToken })
      .pipe(
        tap((res) => this.handleAuthResponse(res)),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  private handleAuthResponse(res: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
    const user = this.decodeToken(res.accessToken);
    this.authStateSubject.next({ authenticated: true, user });
    this.startTokenRefresh();
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return;

    if (this.isTokenExpired(token)) {
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (refreshToken && !this.isTokenExpired(refreshToken)) {
        this.refreshAccessToken().subscribe();
      } else {
        this.logout();
      }
      return;
    }

    const user = this.decodeToken(token);
    this.authStateSubject.next({ authenticated: true, user });
    this.startTokenRefresh();
  }

  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    // Refresh the token every 13 minutes (access token expires in 15 min)
    this.refreshTimerId = setInterval(() => {
      this.refreshAccessToken().subscribe();
    }, 13 * 60 * 1000);
  }

  private stopTokenRefresh(): void {
    if (this.refreshTimerId !== null) {
      clearInterval(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  private decodeToken(token: string): AuthUser {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      const fullName = (payload.fullName ?? '').split(' ');
      const role = (payload.role ?? '').replace(/^ROLE_/i, '');
      const roles = role ? [role] : [];

      return {
        id: payload.userId ?? payload.sub,
        username: payload.sub,
        email: payload.sub,
        firstName: fullName[0] ?? '',
        lastName: fullName.slice(1).join(' ') ?? '',
        roles
      };
    } catch {
      return { id: '', username: '', email: '', firstName: '', lastName: '', roles: [] };
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
