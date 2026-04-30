import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  readonly cart$ = this.cartService.cart$;
  readonly total$ = this.cartService.total$;

  updateQty(id: number, qty: number): void { this.cartService.updateQty(id, qty); }
  remove(id: number, name: string): void { this.cartService.remove(id); this.toast.info(`${name} removed`); }
  clear(): void { this.cartService.clear(); this.toast.info('Cart cleared'); }
}
