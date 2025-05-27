import {
  Component,
  ViewChild,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import type { MatDrawerMode } from '@angular/material/sidenav';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    SpinnerComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  @ViewChild('drawer') sidenav?: MatSidenav;

  // Signals para reatividade
  private readonly sidenavAberto = signal(true);
  readonly sidenavEstaAberto = this.sidenavAberto.asReadonly();

  // Computed para lógica derivada - sempre 'side' para desktop
  readonly modoSidenav = computed((): MatDrawerMode => 'side');
  readonly sidenavDeveriaEstarAberto = computed(() => this.sidenavEstaAberto());

  /**
   * Alterna o estado do sidenav
   */
  alternarSidenav(): void {
    this.sidenavAberto.update((aberto) => !aberto);
  }

  /**
   * Handler para mudanças do sidenav
   */
  onSidenavOpenedChange(opened: boolean): void {
    this.sidenavAberto.set(opened);
  }

  /**
   * Métodos públicos para controle externo
   */
  fecharSidenav(): void {
    this.sidenavAberto.set(false);
  }

  abrirSidenav(): void {
    this.sidenavAberto.set(true);
  }
}
