import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Product,
  ProductPurchasedRequest,
  ProductPurchasedResponse,
  ProductRequest,
  ProductUpdateRequest
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = environment.services.product;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${productId}`);
  }

  createProduct(product: ProductRequest, files: File[]): Observable<number> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return this.http.post<number>(`${this.baseUrl}/create-product`, formData);
  }

  updateProduct(productId: number, payload: ProductUpdateRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${productId}`, payload);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }

  purchaseProducts(payload: ProductPurchasedRequest[]): Observable<ProductPurchasedResponse[]> {
    return this.http.post<ProductPurchasedResponse[]>(`${this.baseUrl}/purchase`, payload);
  }
}
