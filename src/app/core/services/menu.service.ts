import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public obterItensMenu(): MenuItem[] {
    return [
      this.criarItemMenu('home', 'ITEM_MENU_HOME', '/', 'Início'),
      this.criarItemMenuComSubMenu(
        'apps',
        'ITEM_MENU_CADASTROS_BASICOS',
        '',
        'Cadastros Básicos',
        [
          this.criarItemMenu(
            'devices',
            'ITEM_MENU_EQUIPAMENTOS',
            'equipamentos',
            'Equipamentos'
          ),
          this.criarItemMenu(
            'category',
            'ITEM_MENU_CATEGORIAS',
            'cadastrosBasicos/categorias',
            'Categorias'
          ),
          this.criarItemMenu(
            'location_on',
            'ITEM_MENU_LOCALIZACOES',
            'cadastrosBasicos/localizacoes',
            'Localizações'
          ),
        ]
      ),
      this.criarItemMenuComSubMenu(
        'assessment',
        'ITEM_MENU_RELATORIOS',
        '',
        'Relatórios',
        [
          this.criarItemMenu(
            'description',
            'ITEM_MENU_RELATORIO_EQUIPAMENTOS',
            'relatorios/equipamentos',
            'Relatório de Equipamentos'
          ),
          this.criarItemMenu(
            'list_alt',
            'ITEM_MENU_RELATORIO_CATEGORIAS',
            'relatorios/categorias',
            'Relatório de Categorias'
          ),
        ]
      ),
      this.criarItemMenuComSubMenu(
        'settings',
        'ITEM_MENU_CONFIGURACOES',
        '',
        'Configurações',
        [
          this.criarItemMenu(
            'people',
            'ITEM_MENU_USUARIOS',
            'configuracoes/usuarios',
            'Usuários'
          ),
          this.criarItemMenu(
            'admin_panel_settings',
            'ITEM_MENU_PERFIS',
            'configuracoes/perfis',
            'Perfis'
          ),
        ]
      ),
    ];
  }

  private criarItemMenu(
    icone: string,
    permissao: string,
    routerLink: string,
    tooltip: string
  ): MenuItem {
    return {
      icon: icone,
      permission: permissao,
      routerLink,
      tooltip,
      subMenuItem: [],
    };
  }

  private criarItemMenuComSubMenu(
    icone: string,
    permissao: string,
    routerLink: string,
    tooltip: string,
    subMenuItem: MenuItem[]
  ): MenuItem {
    return {
      icon: icone,
      permission: permissao,
      routerLink,
      tooltip,
      subMenuItem,
    };
  }
}
