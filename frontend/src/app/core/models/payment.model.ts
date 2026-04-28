import { PaymentMethod } from './order.model';

export interface CustomerPaymentRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PaymentRequest {
  id: number | null;
  amount: number;
  paymentMethod: PaymentMethod;
  orderId: number;
  orderReference: string;
  customer: CustomerPaymentRequest;
}
