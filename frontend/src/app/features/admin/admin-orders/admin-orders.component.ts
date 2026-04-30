import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { OrderResponse } from '../../../core/models/order.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  page = 1;
  pageSize = 10;

  constructor(private orderService: OrderService) {}
  ngOnInit(): void { this.orderService.findAll().subscribe((o: OrderResponse[]) => this.orders = o); }

  get paged(): OrderResponse[] {
    const s = (this.page - 1) * this.pageSize;
    return this.orders.slice(s, s + this.pageSize);
  }

  formatMethod(m: string): string { return m.replace(/_/g, ' '); }
}
