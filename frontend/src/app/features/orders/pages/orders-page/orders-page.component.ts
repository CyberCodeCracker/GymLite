import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { OrderLineResponse, OrderResponse } from '../../../../core/models/order.model';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderLineService } from '../../../../core/services/order-line.service';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent implements OnInit {
  loading = false;
  errorMessage = '';

  orders: OrderResponse[] = [];
  expandedOrderId: number | null = null;
  linesByOrderId: Record<number, OrderLineResponse[]> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
    private readonly orderLineService: OrderLineService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  toggleLines(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
      return;
    }

    this.expandedOrderId = orderId;

    if (this.linesByOrderId[orderId]) {
      return;
    }

    this.orderLineService.getByOrderId(orderId).subscribe({
      next: (lines) => {
        this.linesByOrderId[orderId] = lines;
      },
      error: () => {
        this.linesByOrderId[orderId] = [];
      }
    });
  }

  private loadOrders(): void {
    const user = this.authService.getUser();
    if (!user?.id) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.orderService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (orders) => {
          this.orders = orders.filter((order) => order.customerId === user.id);
        },
        error: () => {
          this.errorMessage = 'Unable to load your orders right now.';
        }
      });
  }
}
