export interface Address {
  street: string;
  city: string;
  houseNumber: string;
  zipCode: string;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
}
