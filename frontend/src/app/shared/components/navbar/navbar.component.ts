import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  theme = inject(ThemeService);

  mobileOpen = false;
  userMenuOpen = false;
  readonly authState$ = this.auth.authState$;
  readonly itemCount$ = this.cart.itemCount$;

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) this.userMenuOpen = false;
  }

  toggleMobile(): void { this.mobileOpen = !this.mobileOpen; }
  toggleUserMenu(): void { this.userMenuOpen = !this.userMenuOpen; }
  logout(): void { this.userMenuOpen = false; this.auth.logout(); this.router.navigate(['/login']); }
  isAdmin(): boolean { return this.auth.isAdmin(); }
}
