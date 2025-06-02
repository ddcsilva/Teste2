import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
        canActivate: [guestGuard],
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];
