import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem } from '../../models/menu.model';
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
export class SidebarComponent implements OnInit {
  private menuService = inject(MenuService);

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = this.menuService.obterItensMenu();
  }
}
