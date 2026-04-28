import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-panel.component.html',
  styleUrl: './cart-panel.component.scss'
})
export class CartPanelComponent {
  @Input() open = false;
  @Output() closePanel = new EventEmitter<void>();

  readonly items$ = this.cartService.items$;
  readonly itemCount$ = this.cartService.itemCount$;
  readonly totalAmount$ = this.cartService.totalAmount$;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router
  ) {}

  close(): void {
    this.closePanel.emit();
  }

  increase(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  remove(productId: number): void {
    this.cartService.removeItem(productId);
  }

  clear(): void {
    this.cartService.clear();
  }

  goToCheckout(): void {
    this.close();
    void this.router.navigate(['/checkout']);
  }
}
