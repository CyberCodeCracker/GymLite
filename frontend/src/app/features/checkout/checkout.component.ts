import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CartItem } from '../../core/models/cart.model';
import { PaymentMethod } from '../../core/models/order.model';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly cart$ = this.cartService.cart$;
  readonly total$ = this.cartService.total$;
  paymentMethod: PaymentMethod = 'VISA';
  loading = false;
  paymentMethods: PaymentMethod[] = ['VISA', 'MASTER_CARD', 'PAYPAL', 'CREDIT_CARD', 'BITCOIN'];

  address = { street: '', city: '', houseNumber: '', zipCode: '' };

  get addressValid(): boolean {
    return !!this.address.street && !!this.address.city && !!this.address.zipCode;
  }

  placeOrder(): void {
    const items: CartItem[] = this.cartService.getItems();
    if (!items.length) { this.toast.error('Cart is empty'); return; }
    const user = this.auth.getUser();
    if (!user) { this.toast.error('Please login first'); this.router.navigate(['/login']); return; }
    if (!this.addressValid) { this.toast.error('Please fill in your shipping address'); return; }

    const total = items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0);
    this.loading = true;

    // Ensure customer exists, then place order
    this.customerService.findById(user.id).pipe(
      catchError(() =>
        this.customerService.create({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: this.address
        })
      ),
      switchMap(() => this.orderService.create({
        totalAmount: total,
        paymentMethod: this.paymentMethod,
        customerId: user.id,
        products: items.map((i: CartItem) => ({ id: i.productId, availableQuantity: i.quantity }))
      }))
    ).subscribe({
      next: () => {
        this.cartService.clear();
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/products']);
      },
      error: () => { this.loading = false; this.toast.error('Failed to place order'); }
    });
  }

  formatMethod(m: string): string { return m.replace(/_/g, ' '); }

  paymentIconClass(method: PaymentMethod): string {
    const base = 'text-xl w-5 shrink-0 text-center';
    const icons: Record<PaymentMethod, string> = {
      VISA: 'fa-solid fa-credit-card text-blue-400',
      MASTER_CARD: 'fa-solid fa-credit-card text-orange-400',
      PAYPAL: 'fa-solid fa-credit-card text-blue-300',
      CREDIT_CARD: 'fa-solid fa-credit-card text-emerald-400',
      BITCOIN: 'fa-brands fa-bitcoin text-yellow-400'
    };

    return `${icons[method]} ${base}`;
  }
}
