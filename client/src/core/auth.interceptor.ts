import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isRefreshEndpoint = req.url.includes('/api/auth/refresh');

  const withAuthHeader = (token: string | null) =>
    token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

  const logoutAndRedirect = () => {
    authService.logout();
    window.location.href = '/';
  };

  const tryRefresh = () => {
    if (isRefreshEndpoint) {
      return from(Promise.resolve(null));
    }

    const inFlight = authService.getRefreshInFlight();
    if (inFlight) {
      return from(inFlight);
    }

    const refreshPromise = authService
      .refreshAccessToken()
      .finally(() => authService.setRefreshInFlight(null));

    authService.setRefreshInFlight(refreshPromise);
    return from(refreshPromise);
  };

  const currentToken = authService.getToken();
  const requestToken =
    currentToken && !authService.isTokenExpired(currentToken) ? currentToken : null;

  return next(withAuthHeader(requestToken)).pipe(
    catchError((error) => {
      if (error?.status !== 401 || isRefreshEndpoint) {
        return throwError(() => error);
      }

      return tryRefresh().pipe(
        switchMap((newToken) => {
          if (!newToken) {
            logoutAndRedirect();
            return throwError(() => error);
          }
          return next(withAuthHeader(newToken));
        }),
        catchError((refreshError) => {
          logoutAndRedirect();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
