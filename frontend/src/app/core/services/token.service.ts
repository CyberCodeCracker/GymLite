import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser, AuthResponse, JwtPayload } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly API = environment.services.auth;
  private readonly ACCESS_KEY = 'gl_access';
  private readonly REFRESH_KEY = 'gl_refresh';
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  private state$ = new BehaviorSubject<AuthState>({ authenticated: false, user: null });
  readonly authState$ = this.state$.asObservable();

  constructor(private http: HttpClient) { this.restore(); }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API}/authenticate`, { email, password }).pipe(
      tap(r => this.handleAuth(r)), map(() => true),
      catchError(() => of(false))
    );
  }

  register(firstName: string, lastName: string, email: string, password: string, passwordConfirm: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API}/register`, { firstName, lastName, email, password, passwordConfirm }).pipe(
      tap(r => this.handleAuth(r)), map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.stopRefresh();
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.state$.next({ authenticated: false, user: null });
  }

  getAccessToken(): string | null {
    const t = localStorage.getItem(this.ACCESS_KEY);
    return t && !this.expired(t) ? t : null;
  }

  isAuthenticated(): boolean { return this.state$.value.authenticated; }
  getState(): AuthState { return this.state$.value; }

  refresh(): Observable<boolean> {
    const rt = localStorage.getItem(this.REFRESH_KEY);
    if (!rt) return of(false);
    return this.http.post<AuthResponse>(`${this.API}/refresh-token`, { refreshToken: rt }).pipe(
      tap(r => this.handleAuth(r)), map(() => true),
      catchError(() => { this.logout(); return of(false); })
    );
  }

  private handleAuth(r: AuthResponse): void {
    localStorage.setItem(this.ACCESS_KEY, r.accessToken);
    localStorage.setItem(this.REFRESH_KEY, r.refreshToken);
    this.state$.next({ authenticated: true, user: this.decode(r.accessToken) });
    this.startRefresh();
  }

  private restore(): void {
    const t = localStorage.getItem(this.ACCESS_KEY);
    if (!t) return;
    if (this.expired(t)) {
      const rt = localStorage.getItem(this.REFRESH_KEY);
      if (rt && !this.expired(rt)) { this.refresh().subscribe(); }
      else { this.logout(); }
      return;
    }
    this.state$.next({ authenticated: true, user: this.decode(t) });
    this.startRefresh();
  }

  private startRefresh(): void {
    this.stopRefresh();
    this.refreshTimer = setInterval(() => this.refresh().subscribe(), 13 * 60 * 1000);
  }
  private stopRefresh(): void {
    if (this.refreshTimer) { clearInterval(this.refreshTimer); this.refreshTimer = null; }
  }

  private decode(token: string): AuthUser {
    try {
      const p = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      const names = (p.fullName ?? '').split(' ');
      const role = (p.role ?? '').replace(/^ROLE_/i, '');
      return {
        id: p.userId ?? p.sub, username: p.sub, email: p.sub,
        firstName: names[0] ?? '', lastName: names.slice(1).join(' '),
        roles: role ? [role] : []
      };
    } catch { return { id: '', username: '', email: '', firstName: '', lastName: '', roles: [] }; }
  }

  private expired(token: string): boolean {
    try { return Date.now() >= (JSON.parse(atob(token.split('.')[1])) as JwtPayload).exp * 1000; }
    catch { return true; }
  }
}
