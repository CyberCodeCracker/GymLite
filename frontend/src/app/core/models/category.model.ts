import { Product, ProductRequest } from './product.model';

export interface CategoryResponse {
  name: string;
  description: string;
  products: Product[];
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
}

export interface AddProductToCategoryRequest {
  request: ProductRequest;
  categoryId: number;
}
