import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public obterItensMenu(): MenuItem[] {
    return [
      this.criarItemMenu(
        'add_circle',
        'ITEM_MENU_CADASTRO_TESTE',
        'cadastrosBasicos/teste',
        'Cadastro de Teste'
      ),
      this.criarItemMenuComSubMenu(
        'apps',
        'ITEM_MENU_CADASTRO_TESTE',
        '',
        'Cadastros Básicos',
        [
          this.criarItemMenu(
            '',
            'ITEM_MENU_CADASTRO_SUPORTE',
            'cadastrosBasicos/suportePlataforma',
            'Suportes Plataforma'
          ),
          this.criarItemMenu(
            '',
            'ITEM_MENU_CADASTRO_UNIFILAR',
            'cadastrosBasicos/unifilar',
            'Unifilar'
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
