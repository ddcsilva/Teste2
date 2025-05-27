import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <div
      class="layout-container"
      *ngIf="authService.obterUsuario()() as usuario"
    >
      <app-header (manipularMenu)="toggleSidebar()"></app-header>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          #sidenav
          [opened]="sidebarAberta()"
          [mode]="'side'"
          class="sidenav"
        >
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <!-- Fallback para usuário não logado -->
    <div class="no-auth-container" *ngIf="!authService.obterUsuario()()">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .sidenav-container {
        flex: 1;
        margin-top: 64px; /* Altura do header */
      }

      .sidenav {
        width: 280px;
        background-color: #fafafa;
        border-right: 1px solid #e0e0e0;
      }

      .main-content {
        background-color: #f5f5f5;
      }

      .content-wrapper {
        padding: 20px;
        min-height: calc(100vh - 64px);
      }

      .no-auth-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class LayoutComponent {
  authService = inject(AuthService);

  sidebarAberta = signal(true);

  toggleSidebar(): void {
    this.sidebarAberta.update((value) => !value);
  }
}
