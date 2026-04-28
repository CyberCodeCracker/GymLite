import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = environment.services.customer;

  constructor(private readonly http: HttpClient) {}

  create(payload: CustomerRequest): Observable<string> {
    return this.http.post(this.baseUrl, payload, { responseType: 'text' });
  }

  update(payload: CustomerRequest, id: number): Observable<void> {
    const params = new HttpParams().set('id', String(id));
    return this.http.put<void>(this.baseUrl, payload, { params });
  }

  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

  existsById(customerId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${customerId}`);
  }

  getById(customerId: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.baseUrl}/${customerId}`);
  }

  delete(customerId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${customerId}`);
  }
}
