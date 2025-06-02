import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../../shared/models/login.model';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  chave: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioLogado = signal<Usuario | null>(null);

  obterUsuario() {
    return this.usuarioLogado.asReadonly();
  }

  estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }

  logar(dadosLogin: Login): Observable<Usuario> {
    // Simulando uma chamada de API
    return new Observable((observer) => {
      // Simulação de delay de rede
      setTimeout(() => {
        // Validação simples para demo
        if (dadosLogin.chave === 'ADMIN' && dadosLogin.senha === '123456') {
          const usuario: Usuario = {
            id: 1,
            nome: 'Administrador',
            email: 'admin@petrobras.com.br',
            perfil: 'Administrador',
            chave: dadosLogin.chave,
          };

          this.usuarioLogado.set(usuario);
          observer.next(usuario);
          observer.complete();
        } else {
          observer.error('Credenciais inválidas');
        }
      }, 1500); // Simula delay de 1.5s
    });
  }

  logout(): void {
    this.usuarioLogado.set(null);
  }
}
