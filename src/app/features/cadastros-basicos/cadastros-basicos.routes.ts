import { Routes } from '@angular/router';

export const cadastrosBasicosRoutes: Routes = [
  {
    path: 'equipamentos',
    loadChildren: () =>
      import('../equipamentos/equipamentos.routes').then(
        (m) => m.equipamentosRoutes
      ),
  },
  // Rotas futuras - comentadas até implementação dos componentes
  // {
  //   path: 'categorias',
  //   loadComponent: () =>
  //     import('./pages/categorias/categorias.component').then(
  //       (m) => m.CategoriasComponent
  //     ),
  // },
  // {
  //   path: 'localizacoes',
  //   loadComponent: () =>
  //     import('./pages/localizacoes/localizacoes.component').then(
  //       (m) => m.LocalizacoesComponent
  //     ),
  // },
];
