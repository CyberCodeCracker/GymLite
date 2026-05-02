import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderRequest, OrderResponse, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = environment.services.order;
  constructor(private http: HttpClient) {}
  create(req: OrderRequest): Observable<number> { return this.http.post<number>(this.API, req); }
  findAll(): Observable<OrderResponse[]> { return this.http.get<OrderResponse[]>(this.API); }
  findById(id: number): Observable<OrderResponse> { return this.http.get<OrderResponse>(`${this.API}/${id}`); }
  updateStatus(id: number, status: OrderStatus): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.API}/${id}/status`, { status });
  }
}
