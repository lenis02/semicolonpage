import { Route } from '@angular/router';
import { AuthCallbackComponent } from '../core/auth-callback';

export const appRoutes: Route[] = [
  { path: 'login/success', component: AuthCallbackComponent },
];
