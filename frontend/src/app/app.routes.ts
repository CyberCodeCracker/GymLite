import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      )
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shop/pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      )
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/pages/checkout-page/checkout-page.component').then(
        (m) => m.CheckoutPageComponent
      )
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/orders-page/orders-page.component').then(
        (m) => m.OrdersPageComponent
      )
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      )
  },
  {
    path: 'admin/products',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin', 'ROLE_ADMIN']
    },
    loadComponent: () =>
      import('./features/admin/pages/admin-products-page/admin-products-page.component').then(
        (m) => m.AdminProductsPageComponent
      )
  },
  {
    path: 'admin/categories',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin', 'ROLE_ADMIN']
    },
    loadComponent: () =>
      import('./features/admin/pages/admin-categories-page/admin-categories-page.component').then(
        (m) => m.AdminCategoriesPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
