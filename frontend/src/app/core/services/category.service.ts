import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = environment.services.category;
  constructor(private http: HttpClient) {}
  findAll(): Observable<Category[]> { return this.http.get<Category[]>(this.API); }
  findById(id: number): Observable<Category> { return this.http.get<Category>(`${this.API}/${id}`); }
  create(req: CategoryRequest): Observable<number> { return this.http.post<number>(`${this.API}/create-category`, req); }
  update(id: number, req: CategoryRequest): Observable<Category> { return this.http.patch<Category>(`${this.API}/${id}`, req); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
