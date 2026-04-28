import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoryRequest,
  CategoryResponse,
  CategoryUpdateRequest
} from '../models/category.model';
import { ProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = environment.services.category;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.baseUrl);
  }

  getById(categoryId: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${categoryId}`);
  }

  create(payload: CategoryRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/create-category`, payload);
  }

  addProductToCategory(categoryId: number, payload: ProductRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${categoryId}/add-product`, payload);
  }

  update(categoryId: number, payload: CategoryUpdateRequest): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(`${this.baseUrl}/${categoryId}`, payload);
  }

  delete(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${categoryId}`);
  }
}
