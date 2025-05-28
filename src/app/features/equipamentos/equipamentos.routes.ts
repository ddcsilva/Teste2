import { Routes } from '@angular/router';

export const equipamentosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/equipamentos.component').then(
        (m) => m.EquipamentosComponent
      ),
  },
  {
    path: 'incluir',
    loadComponent: () =>
      import('./pages/equipamento-create.component').then(
        (m) => m.EquipamentoCreateComponent
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/equipamento-edit.component').then(
        (m) => m.EquipamentoEditComponent
      ),
  },
  // Futuras rotas do módulo equipamentos podem ser adicionadas aqui
  // {
  //   path: 'novo',
  //   loadComponent: () => import('./pages/equipamento-form.component').then(m => m.EquipamentoFormComponent)
  // },
  // {
  //   path: ':id/editar',
  //   loadComponent: () => import('./pages/equipamento-form.component').then(m => m.EquipamentoFormComponent)
  // }
];
