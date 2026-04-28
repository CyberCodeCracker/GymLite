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
  id: number | null;
  name: string;
  description: string;
  availableQuantity: number;
  price: number;
  categoryId: number;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  availableQuantity?: number;
  price?: number;
  categoryId?: number;
}

export interface ProductPurchasedRequest {
  id: number;
  availableQuantity: number;
}

export interface ProductPurchasedResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
}
