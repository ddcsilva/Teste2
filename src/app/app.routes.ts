import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
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
    ],
  },
];
