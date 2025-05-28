import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // Dados estáticos - criados uma única vez (sem o Home que agora é hardcoded)
  private readonly itensMenu: MenuItem[] = [
    {
      icon: 'apps',
      permission: 'ITEM_MENU_CADASTROS_BASICOS',
      routerLink: '',
      tooltip: 'Cadastros Básicos',
      subMenuItem: [
        {
          permission: 'ITEM_MENU_EQUIPAMENTOS',
          routerLink: 'equipamentos',
          tooltip: 'Equipamentos',
        },
        {
          permission: 'ITEM_MENU_CATEGORIAS',
          routerLink: 'cadastrosBasicos/categorias',
          tooltip: 'Categorias',
        },
        {
          permission: 'ITEM_MENU_LOCALIZACOES',
          routerLink: 'cadastrosBasicos/localizacoes',
          tooltip: 'Localizações',
        },
      ],
    },
    {
      icon: 'assessment',
      permission: 'ITEM_MENU_RELATORIOS',
      routerLink: '',
      tooltip: 'Relatórios',
      subMenuItem: [
        {
          permission: 'ITEM_MENU_RELATORIO_EQUIPAMENTOS',
          routerLink: 'relatorios/equipamentos',
          tooltip: 'Relatório de Equipamentos',
        },
        {
          permission: 'ITEM_MENU_RELATORIO_CATEGORIAS',
          routerLink: 'relatorios/categorias',
          tooltip: 'Relatório de Categorias',
        },
      ],
    },
    {
      icon: 'settings',
      permission: 'ITEM_MENU_CONFIGURACOES',
      routerLink: '',
      tooltip: 'Configurações',
      subMenuItem: [
        {
          permission: 'ITEM_MENU_USUARIOS',
          routerLink: 'configuracoes/usuarios',
          tooltip: 'Usuários',
        },
        {
          permission: 'ITEM_MENU_PERFIS',
          routerLink: 'configuracoes/perfis',
          tooltip: 'Perfis',
        },
      ],
    },
  ];

  public obterItensMenu(): MenuItem[] {
    return this.itensMenu;
  }
}
