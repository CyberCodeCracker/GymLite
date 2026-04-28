import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderLineResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderLineService {
  private readonly baseUrl = environment.services.orderLine;

  constructor(private readonly http: HttpClient) {}

  getByOrderId(orderId: number): Observable<OrderLineResponse[]> {
    return this.http.get<OrderLineResponse[]>(`${this.baseUrl}/order/${orderId}`);
  }
}
