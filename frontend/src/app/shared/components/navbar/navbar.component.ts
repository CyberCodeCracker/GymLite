import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

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

  mobileOpen = false;
  readonly authState$ = this.auth.authState$;
  readonly itemCount$ = this.cart.itemCount$;

  toggleMobile(): void { this.mobileOpen = !this.mobileOpen; }
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
  isAdmin(): boolean { return this.auth.isAdmin(); }
}
