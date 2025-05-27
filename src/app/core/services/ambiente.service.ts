import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AmbienteService {
  private ambiente: string | null = null;

  constructor() {
    // Detecta o ambiente baseado na URL ou configuração
    this.detectarAmbiente();
  }

  obterAmbiente(): string | null {
    return this.ambiente;
  }

  private detectarAmbiente(): void {
    const hostname = window.location.hostname;

    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      this.ambiente = 'Desenvolvimento';
    } else if (
      hostname.includes('dev') ||
      hostname.includes('desenvolvimento')
    ) {
      this.ambiente = 'Desenvolvimento';
    } else if (hostname.includes('hom') || hostname.includes('homologacao')) {
      this.ambiente = 'Homologação';
    } else if (hostname.includes('test') || hostname.includes('teste')) {
      this.ambiente = 'Teste';
    } else {
      // Produção não mostra tarja
      this.ambiente = null;
    }
  }
}
