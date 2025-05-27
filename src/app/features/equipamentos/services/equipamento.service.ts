import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';
import { EquipamentoFiltro } from '../models/equipamento-filtro.model';
import { ResponseGeneric } from '../../../core/models/response-generic';

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  obterDadosParaGrid(
    paginaAtual: number,
    itensPorPagina: number,
    codigo: string,
    categoria: string,
    localizacao: string
  ): Observable<{ itens: Equipamento[]; totalItens: number }> {
    // Dados de exemplo para teste
    const mockData: Equipamento[] = [
      {
        id: 1,
        codigo: 'EQP001',
        categoriaId: 1,
        categoria: 'Servidor',
        codigoLocalizacao: 'LOC001',
        localizacao: 'Sala de Servidores A',
        linkDiagrama: 'http://example.com/diagram1',
      },
      {
        id: 2,
        codigo: 'EQP002',
        categoriaId: 2,
        categoria: 'Workstation',
        codigoLocalizacao: 'LOC002',
        localizacao: 'Escritório Principal',
        linkDiagrama: 'http://example.com/diagram2',
      },
      {
        id: 3,
        codigo: 'EQP003',
        categoriaId: 3,
        categoria: 'Impressora',
        codigoLocalizacao: 'LOC003',
        localizacao: 'Recepção',
        linkDiagrama: 'http://example.com/diagram3',
      },
    ];

    return of({ itens: mockData, totalItens: mockData.length });
  }

  excluir(id: number): Observable<ResponseGeneric> {
    return of({ success: true, message: 'Equipamento excluído com sucesso' });
  }

  exportarExcel(filtros: EquipamentoFiltro): Observable<any> {
    return of({ data: 'excel data' });
  }
}
