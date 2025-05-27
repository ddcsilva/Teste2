import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SuportePlataforma } from '../models/suporte-plataforma.model';
import { SuportePlataformaFiltro } from '../models/suporte-plataforma-filtro.model';
import { ResponseGeneric } from '../../../core/models/response-generic';

@Injectable({
  providedIn: 'root',
})
export class SuportePlataformaService {
  obterDadosParaGrid(
    paginaAtual: number,
    itensPorPagina: number,
    suporte: string,
    plataforma: string,
    posicao: string
  ): Observable<{ itens: SuportePlataforma[]; totalItens: number }> {
    // Stub implementation - in a real app this would call an API
    const mockData: SuportePlataforma[] = [
      {
        id: 1,
        codigoSuporte: 'SUP001',
        plataformaId: 1,
        codigoPlataforma: 'PLAT001',
        codigoPosicaoSuporte: 'POS001',
        posicaoSuporte: 'Posição 1',
        linkDiagrama: 'http://example.com/diagram1',
      },
      {
        id: 2,
        codigoSuporte: 'SUP002',
        plataformaId: 2,
        codigoPlataforma: 'PLAT002',
        codigoPosicaoSuporte: 'POS002',
        posicaoSuporte: 'Posição 2',
        linkDiagrama: 'http://example.com/diagram2',
      },
    ];

    return of({ itens: mockData, totalItens: mockData.length });
  }

  excluir(id: number): Observable<ResponseGeneric> {
    // Stub implementation
    return of({ success: true, message: 'Item excluído com sucesso' });
  }

  exportarExcel(filtros: SuportePlataformaFiltro): Observable<any> {
    // Stub implementation
    return of({ data: 'excel data' });
  }
}
