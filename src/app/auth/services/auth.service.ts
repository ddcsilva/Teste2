import { Injectable, signal } from '@angular/core';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioLogado = signal<Usuario | null>({
    id: 1,
    nome: 'Usuário Teste',
    email: 'usuario@teste.com',
    perfil: 'Administrador',
  });

  obterUsuario() {
    return this.usuarioLogado.asReadonly();
  }

  estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }

  login(usuario: Usuario): void {
    this.usuarioLogado.set(usuario);
  }

  logout(): void {
    this.usuarioLogado.set(null);
  }
}
