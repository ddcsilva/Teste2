import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastrosBasicos/suportePlataforma',
    loadComponent: () =>
      import(
        './features/suporte-plataforma/pages/suporte-plataforma.component'
      ).then((m) => m.SuportePlataformaComponent),
  },
  {
    path: '',
    redirectTo: '/cadastrosBasicos/suportePlataforma',
    pathMatch: 'full',
  },
];
