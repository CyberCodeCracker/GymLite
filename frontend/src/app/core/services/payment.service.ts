import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = environment.services.payment;

  constructor(private readonly http: HttpClient) {}

  create(payload: PaymentRequest): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }
}
