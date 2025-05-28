import { Routes } from '@angular/router';

export const relatoriosRoutes: Routes = [
  {
    path: 'equipamentos',
    loadComponent: () =>
      import(
        './pages/relatorio-equipamentos/relatorio-equipamentos.component'
      ).then((m) => m.RelatorioEquipamentosComponent),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import(
        './pages/relatorio-categorias/relatorio-categorias.component'
      ).then((m) => m.RelatorioCategoriasComponent),
  },
];
