import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { TarjaPipe } from '../../pipes/tarja.pipe';
import { UsuarioComponent } from '../usuario/usuario.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TarjaPipe,
    UsuarioComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() manipularMenu = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  readonly titulo = signal<string>('Teste');
  readonly subtitulo = signal<string>('Sistema de Testes');

  readonly usuario = this.authService.obterUsuario();
  readonly usuarioEstaLogado = computed(() => !!this.usuario());

  atualizarTitulo(novoTitulo: string): void {
    if (novoTitulo?.trim()) {
      this.titulo.set(novoTitulo.trim());
    }
  }

  atualizarSubtitulo(novoSubtitulo: string): void {
    if (novoSubtitulo?.trim()) {
      this.subtitulo.set(novoSubtitulo.trim());
    }
  }

  aoClicarNoMenu(): void {
    if (this.usuarioEstaLogado()) {
      this.manipularMenu.emit();
    }
  }
}
