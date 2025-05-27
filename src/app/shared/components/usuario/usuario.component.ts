import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <div
      class="usuario-container"
      *ngIf="authService.obterUsuario()() as usuario"
    >
      <button
        mat-icon-button
        [matMenuTriggerFor]="userMenu"
        class="usuario-botao"
      >
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="usuario-info">
          <div class="usuario-nome">{{ usuario.nome }}</div>
          <div class="usuario-email">{{ usuario.email }}</div>
          <div class="usuario-perfil">{{ usuario.perfil }}</div>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [
    `
      .usuario-container {
        display: flex;
        align-items: center;
      }

      .usuario-botao {
        color: white !important;
      }

      .usuario-info {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
        min-width: 200px;
      }

      .usuario-nome {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .usuario-email {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .usuario-perfil {
        font-size: 11px;
        color: #999;
        font-style: italic;
      }
    `,
  ],
})
export class UsuarioComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
