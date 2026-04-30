import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly API = environment.services.customer;
  constructor(private http: HttpClient) {}
  findAll(): Observable<Customer[]> { return this.http.get<Customer[]>(this.API); }
  findById(id: string): Observable<Customer> { return this.http.get<Customer>(`${this.API}/${id}`); }
  create(req: Customer): Observable<string> { return this.http.post<string>(this.API, req); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
