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
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.homeRoutes),
      },
      {
        path: 'equipamentos',
        loadChildren: () =>
          import('./features/equipamentos/equipamentos.routes').then(
            (m) => m.equipamentosRoutes
          ),
        data: { preload: true },
      },
      // Rotas futuras - comentadas até implementação
      // {
      //   path: 'cadastrosBasicos',
      //   loadChildren: () =>
      //     import('./features/cadastros-basicos/cadastros-basicos.routes').then(
      //       (m) => m.cadastrosBasicosRoutes
      //     ),
      //   data: { preload: true },
      // },
      // {
      //   path: 'relatorios',
      //   loadChildren: () =>
      //     import('./features/relatorios/relatorios.routes').then(
      //       (m) => m.relatoriosRoutes
      //     ),
      // },
      // {
      //   path: 'configuracoes',
      //   loadChildren: () =>
      //     import('./features/configuracoes/configuracoes.routes').then(
      //       (m) => m.configuracoesRoutes
      //     ),
      // },

      // Redirecionamentos para compatibilidade
      {
        path: 'cadastrosBasicos/equipamentos',
        redirectTo: 'equipamentos',
        pathMatch: 'full',
      },
    ],
  },
  // Rota 404 - deve ser a última
  {
    path: '**',
    redirectTo: '',
  },
];
