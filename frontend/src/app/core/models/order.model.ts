export type PaymentMethod = 'PAYPAL' | 'CREDIT_CARD' | 'VISA' | 'MASTER_CARD' | 'BITCOIN';

export interface PurchaseRequest {
  id: number;
  availableQuantity: number;
}

export interface OrderRequest {
  totalAmount: number;
  paymentMethod: PaymentMethod;
  customerId: string;
  products: PurchaseRequest[];
}

export interface OrderResponse {
  id: number;
  reference: string;
  amount: number;
  paymentMethod: PaymentMethod;
  customerId: string;
}
