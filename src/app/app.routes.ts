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
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'equipamentos',
        loadComponent: () =>
          import('./features/equipamentos/pages/equipamentos.component').then(
            (m) => m.EquipamentosComponent
          ),
      },
      {
        path: 'cadastrosBasicos/equipamentos',
        redirectTo: 'equipamentos',
        pathMatch: 'full',
      },
    ],
  },
];
