import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = environment.services.product;
  constructor(private http: HttpClient) {}

  findAll(): Observable<Product[]> { return this.http.get<Product[]>(this.API); }
  findById(id: number): Observable<Product> { return this.http.get<Product>(`${this.API}/${id}`); }

  create(product: ProductRequest, files: File[]): Observable<number> {
    const fd = new FormData();
    fd.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    files.forEach(f => fd.append('files', f));
    return this.http.post<number>(`${this.API}/create-product`, fd);
  }

  update(id: number, req: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.API}/${id}`, req);
  }

  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }

  addImages(id: number, files: File[]): Observable<void> {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return this.http.post<void>(`${this.API}/${id}/images`, fd);
  }

  deleteImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${productId}/images/${imageId}`);
  }
}
