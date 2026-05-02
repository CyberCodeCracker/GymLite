import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { OrderResponse, OrderStatus } from '../../../core/models/order.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  orders: OrderResponse[] = [];
  page = 1;
  pageSize = 10;
  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  ngOnInit(): void { this.load(); }
  load(): void { this.orderService.findAll().subscribe(o => this.orders = o); }

  get paged(): OrderResponse[] {
    const s = (this.page - 1) * this.pageSize;
    return this.orders.slice(s, s + this.pageSize);
  }

  onStatusChange(orderId: number, newStatus: OrderStatus): void {
    this.orderService.updateStatus(orderId, newStatus).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === orderId);
        if (idx >= 0) this.orders[idx] = updated;
        this.toast.success(`Order #${orderId} → ${newStatus}`);
      },
      error: () => this.toast.error('Failed to update status')
    });
  }

  formatMethod(m: string): string { return m.replace(/_/g, ' '); }

  statusStyle(status: OrderStatus): Record<string, string> {
    const styles: Record<OrderStatus, { hue: string; darkText: string; lightText: string }> = {
      PENDING: { hue: '#f59e0b', darkText: '#fcd34d', lightText: '#b45309' },
      CONFIRMED: { hue: '#3b82f6', darkText: '#93c5fd', lightText: '#1d4ed8' },
      PROCESSING: { hue: '#f97316', darkText: '#fdba74', lightText: '#c2410c' },
      SHIPPED: { hue: '#a855f7', darkText: '#d8b4fe', lightText: '#7e22ce' },
      DELIVERED: { hue: '#22c55e', darkText: '#86efac', lightText: '#15803d' },
      CANCELLED: { hue: '#ef4444', darkText: '#fca5a5', lightText: '#b91c1c' }
    };
    const color = styles[status];

    return {
      '--status-hue': color.hue,
      '--status-dark-text': color.darkText,
      '--status-light-text': color.lightText
    };
  }
}
