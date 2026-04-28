import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize, of, switchMap } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { CustomerRequest } from '../../../../core/models/customer.model';
import { OrderRequest, PaymentMethod } from '../../../../core/models/order.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  readonly paymentMethods: PaymentMethod[] = [
    'CREDIT_CARD',
    'PAYPAL',
    'VISA',
    'MASTER_CARD',
    'BITCOIN'
  ];

  readonly checkoutForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    street: [''],
    city: [''],
    houseNumber: [''],
    zipCode: [''],
    paymentMethod: ['CREDIT_CARD' as PaymentMethod, Validators.required]
  });

  items: CartItem[] = [];
  totalAmount = 0;
  submitting = false;
  errorMessage = '';
  orderId: number | null = null;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.prefillWithAuthenticatedUser();
    this.bindCartState();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.items.length === 0 || this.submitting) {
      return;
    }

    const user = this.authService.getUser();
    if (!user?.id) {
      void this.router.navigate(['/login'], {
        queryParams: { redirect: '/checkout' }
      });
      return;
    }

    const customerPayload = this.buildCustomerPayload(user.id);
    const orderPayload = this.buildOrderPayload(user.id);

    this.errorMessage = '';
    this.orderId = null;
    this.submitting = true;

    this.customerService
      .existsById(user.id)
      .pipe(
        switchMap((exists) =>
          exists
            ? of('existing-customer')
            : this.customerService.create(customerPayload)
        ),
        switchMap(() => this.orderService.create(orderPayload)),
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (createdOrderId) => {
          this.orderId = createdOrderId;
          this.cartService.clear();
        },
        error: () => {
          this.errorMessage = 'Order placement failed. Please verify your details and try again.';
        }
      });
  }

  continueShopping(): void {
    void this.router.navigate(['/products']);
  }

  private bindCartState(): void {
    this.subscriptions.add(
      this.cartService.items$.subscribe((items) => {
        this.items = items;
      })
    );

    this.subscriptions.add(
      this.cartService.totalAmount$.subscribe((totalAmount) => {
        this.totalAmount = Number(totalAmount.toFixed(2));
      })
    );
  }

  private prefillWithAuthenticatedUser(): void {
    const user = this.authService.getUser();
    if (!user) {
      return;
    }

    this.checkoutForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }

  private buildCustomerPayload(customerId: string): CustomerRequest {
    const rawValue = this.checkoutForm.getRawValue();

    return {
      id: customerId,
      firstName: rawValue.firstName,
      lastName: rawValue.lastName,
      email: rawValue.email,
      address: {
        street: rawValue.street,
        city: rawValue.city,
        houseNumber: rawValue.houseNumber,
        zipCode: rawValue.zipCode
      }
    };
  }

  private buildOrderPayload(customerId: string): OrderRequest {
    const rawValue = this.checkoutForm.getRawValue();

    return {
      id: null,
      reference: this.generateReference(),
      totalAmount: this.totalAmount,
      paymentMethod: rawValue.paymentMethod,
      customerId,
      products: this.items.map((item) => ({
        id: item.product.id,
        availableQuantity: item.quantity
      }))
    };
  }

  private generateReference(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `GL-${timestamp}`;
  }
}
