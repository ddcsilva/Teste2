import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaLogado()) {
    return true;
  }

  // Redireciona para home se já estiver autenticado
  router.navigate(['/']);
  return false;
};
