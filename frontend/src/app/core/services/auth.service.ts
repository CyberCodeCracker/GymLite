import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly authState$: Observable<AuthState>;
  constructor(private tokenService: TokenService) {
    this.authState$ = this.tokenService.authState$;
  }
  isAuthenticated(): boolean { return this.tokenService.isAuthenticated(); }
  login(email: string, password: string): Observable<boolean> { return this.tokenService.login(email, password); }
  register(fn: string, ln: string, email: string, pw: string, pwc: string): Observable<boolean> {
    return this.tokenService.register(fn, ln, email, pw, pwc);
  }
  logout(): void { this.tokenService.logout(); }
  getAccessToken(): string | null { return this.tokenService.getAccessToken(); }
  getUser(): AuthUser | null { return this.tokenService.getState().user; }
  hasRole(role: string): boolean {
    const u = this.getUser();
    if (!u) return false;
    const n = role.replace(/^role_/i, '').toLowerCase();
    return u.roles.some(r => r.replace(/^role_/i, '').toLowerCase() === n);
  }
  hasAnyRole(roles: readonly string[]): boolean { return roles.some(r => this.hasRole(r)); }
  isAdmin(): boolean { return this.hasAnyRole(environment.roles.admin); }
}
