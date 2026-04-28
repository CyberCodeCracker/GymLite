import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const apiBaseUrls = Object.values(environment.services);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  // Don't attach token to auth endpoints
  if (request.url.includes('/api/auth/')) {
    return next(request);
  }

  const shouldAttachToken = apiBaseUrls.some((baseUrl) => request.url.startsWith(baseUrl));

  if (!shouldAttachToken) {
    return next(request);
  }

  const token = authService.getAccessToken();
  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
