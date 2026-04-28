import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly authState$: Observable<AuthState>;

  constructor(private readonly tokenService: TokenService) {
    this.authState$ = this.tokenService.authState$;
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.tokenService.login(email, password);
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Observable<boolean> {
    return this.tokenService.register(firstName, lastName, email, password, passwordConfirm);
  }

  logout(): void {
    this.tokenService.logout();
  }

  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  getUser(): AuthUser | null {
    return this.tokenService.getCurrentState().user;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    const expected = this.normalizeRole(role);
    return user.roles.some((currentRole) => this.normalizeRole(currentRole) === expected);
  }

  hasAnyRole(roles: readonly string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  isAdmin(): boolean {
    return this.hasAnyRole(environment.roles.admin);
  }

  private normalizeRole(role: string): string {
    return role.replace(/^role_/i, '').replace(/^ROLE_/i, '').trim().toLowerCase();
  }
}
