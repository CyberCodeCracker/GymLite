export interface Product {
  id: number;
  name: string;
  description: string;
  availableQuantity: number;
  price: number;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  imageUrls: string[];
}

export interface ProductRequest {
  id?: number;
  name: string;
  description: string;
  availableQuantity: number;
  price: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  availableQuantity?: number;
  price?: number;
  categoryId?: number;
}
