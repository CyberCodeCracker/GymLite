export const environment = {
  production: false,
  services: {
    auth: 'http://localhost:8222/api/auth',
    product: 'http://localhost:8222/api/product',
    category: 'http://localhost:8222/api/category',
    customer: 'http://localhost:8222/api/customer',
    order: 'http://localhost:8222/api/order',
    orderLine: 'http://localhost:8222/api/order-line',
    payment: 'http://localhost:8222/api/payment'
  },
  roles: {
    admin: ['admin', 'role_admin', 'ADMIN'],
    customer: ['user', 'role_user', 'customer', 'role_customer', 'CUSTOMER']
  }
} as const;
