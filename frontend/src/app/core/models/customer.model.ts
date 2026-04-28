import { Address } from './address.model';

export interface CustomerRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
}

export interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
}
