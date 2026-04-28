import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() cartToggle = new EventEmitter<void>();

  readonly authState$ = this.authService.authState$;
  readonly itemCount$ = this.cartService.itemCount$;

  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly router: Router
  ) {}

  openCart(): void {
    this.cartToggle.emit();
  }

  login(): void {
    void this.router.navigate(['/login']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
