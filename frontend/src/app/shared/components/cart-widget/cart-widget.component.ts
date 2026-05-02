import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-widget.component.html'
})
export class CartWidgetComponent {
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  open = false;
  showScroll = false;
  readonly cart$ = this.cartService.cart$;
  readonly itemCount$ = this.cartService.itemCount$;
  readonly total$ = this.cartService.total$;

  @HostListener('window:scroll')
  onScroll(): void { this.showScroll = window.scrollY > 300; }

  toggle(): void { this.open = !this.open; }
  close(): void { this.open = false; }
  scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  updateQty(id: number, qty: number): void { this.cartService.updateQty(id, qty); }
  remove(id: number, name: string): void { this.cartService.remove(id); this.toast.info(`${name} removed`); }
}
