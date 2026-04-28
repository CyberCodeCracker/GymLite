import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly baseUrl = environment.services.order;

  constructor(private readonly http: HttpClient) {}

  create(payload: OrderRequest): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  getById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`);
  }
}
