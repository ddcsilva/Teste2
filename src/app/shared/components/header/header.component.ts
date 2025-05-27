import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
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

  private authService = inject(AuthService);

  readonly titulo = signal<string>('Teste');
  readonly subtitulo = signal<string>('Sistema de Testes');

  usuario = this.authService.obterUsuario();

  atualizarTitulo(novoTitulo: string): void {
    this.titulo.set(novoTitulo);
  }

  atualizarSubtitulo(novoSubtitulo: string): void {
    this.subtitulo.set(novoSubtitulo);
  }

  aoClicarNoMenu(): void {
    this.manipularMenu.emit();
  }
}
