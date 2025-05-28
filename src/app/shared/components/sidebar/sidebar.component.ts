import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem, SubMenuItem } from '../../models/menu.model';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    HasPermissionDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private menuService = inject(MenuService);

  readonly menuItems: MenuItem[] = this.menuService.obterItensMenu();

  trackByMenuItem(index: number, item: MenuItem): string {
    return item.permission + item.routerLink;
  }

  trackBySubMenuItem(index: number, item: SubMenuItem): string {
    return item.permission + item.routerLink;
  }
}
