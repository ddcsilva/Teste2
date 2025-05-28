import { Routes } from '@angular/router';

export const cadastrosBasicosRoutes: Routes = [
  {
    path: 'categorias',
    loadComponent: () =>
      import('./pages/categorias/categorias.component').then(
        (m) => m.CategoriasComponent
      ),
  },
  {
    path: 'localizacoes',
    loadComponent: () =>
      import('./pages/localizacoes/localizacoes.component').then(
        (m) => m.LocalizacoesComponent
      ),
  },
];
