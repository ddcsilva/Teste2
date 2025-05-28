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
    // Dados de exemplo expandidos para teste de paginação
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
      {
        id: 4,
        codigo: 'EQP004',
        categoriaId: 1,
        categoria: 'Servidor',
        codigoLocalizacao: 'LOC001',
        localizacao: 'Sala de Servidores A',
        linkDiagrama: 'http://example.com/diagram4',
      },
      {
        id: 5,
        codigo: 'EQP005',
        categoriaId: 4,
        categoria: 'Switch',
        codigoLocalizacao: 'LOC004',
        localizacao: 'Sala de Rede',
        linkDiagrama: 'http://example.com/diagram5',
      },
      {
        id: 6,
        codigo: 'EQP006',
        categoriaId: 5,
        categoria: 'Roteador',
        codigoLocalizacao: 'LOC004',
        localizacao: 'Sala de Rede',
        linkDiagrama: 'http://example.com/diagram6',
      },
      {
        id: 7,
        codigo: 'EQP007',
        categoriaId: 2,
        categoria: 'Workstation',
        codigoLocalizacao: 'LOC005',
        localizacao: 'Departamento TI',
        linkDiagrama: 'http://example.com/diagram7',
      },
      {
        id: 8,
        codigo: 'EQP008',
        categoriaId: 6,
        categoria: 'Monitor',
        codigoLocalizacao: 'LOC002',
        localizacao: 'Escritório Principal',
        linkDiagrama: 'http://example.com/diagram8',
      },
      {
        id: 9,
        codigo: 'EQP009',
        categoriaId: 3,
        categoria: 'Impressora',
        codigoLocalizacao: 'LOC006',
        localizacao: 'Departamento Financeiro',
        linkDiagrama: 'http://example.com/diagram9',
      },
      {
        id: 10,
        codigo: 'EQP010',
        categoriaId: 7,
        categoria: 'Notebook',
        codigoLocalizacao: 'LOC007',
        localizacao: 'Sala de Reuniões',
        linkDiagrama: 'http://example.com/diagram10',
      },
      {
        id: 11,
        codigo: 'EQP011',
        categoriaId: 1,
        categoria: 'Servidor',
        codigoLocalizacao: 'LOC008',
        localizacao: 'Sala de Servidores B',
        linkDiagrama: 'http://example.com/diagram11',
      },
      {
        id: 12,
        codigo: 'EQP012',
        categoriaId: 8,
        categoria: 'Firewall',
        codigoLocalizacao: 'LOC004',
        localizacao: 'Sala de Rede',
        linkDiagrama: 'http://example.com/diagram12',
      },
      {
        id: 13,
        codigo: 'EQP013',
        categoriaId: 2,
        categoria: 'Workstation',
        codigoLocalizacao: 'LOC009',
        localizacao: 'Departamento RH',
        linkDiagrama: 'http://example.com/diagram13',
      },
      {
        id: 14,
        codigo: 'EQP014',
        categoriaId: 9,
        categoria: 'Scanner',
        codigoLocalizacao: 'LOC003',
        localizacao: 'Recepção',
        linkDiagrama: 'http://example.com/diagram14',
      },
      {
        id: 15,
        codigo: 'EQP015',
        categoriaId: 10,
        categoria: 'Projetor',
        codigoLocalizacao: 'LOC007',
        localizacao: 'Sala de Reuniões',
        linkDiagrama: 'http://example.com/diagram15',
      },
      {
        id: 16,
        codigo: 'EQP016',
        categoriaId: 4,
        categoria: 'Switch',
        codigoLocalizacao: 'LOC010',
        localizacao: 'Andar 2 - Rede',
        linkDiagrama: 'http://example.com/diagram16',
      },
      {
        id: 17,
        codigo: 'EQP017',
        categoriaId: 7,
        categoria: 'Notebook',
        codigoLocalizacao: 'LOC011',
        localizacao: 'Departamento Vendas',
        linkDiagrama: 'http://example.com/diagram17',
      },
      {
        id: 18,
        codigo: 'EQP018',
        categoriaId: 11,
        categoria: 'UPS',
        codigoLocalizacao: 'LOC001',
        localizacao: 'Sala de Servidores A',
        linkDiagrama: 'http://example.com/diagram18',
      },
      {
        id: 19,
        codigo: 'EQP019',
        categoriaId: 6,
        categoria: 'Monitor',
        codigoLocalizacao: 'LOC012',
        localizacao: 'Laboratório',
        linkDiagrama: 'http://example.com/diagram19',
      },
      {
        id: 20,
        codigo: 'EQP020',
        categoriaId: 12,
        categoria: 'Tablet',
        codigoLocalizacao: 'LOC013',
        localizacao: 'Área de Atendimento',
        linkDiagrama: 'http://example.com/diagram20',
      },
    ];

    // Implementar lógica de paginação real
    const totalItens = mockData.length;
    const startIndex = paginaAtual * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;
    const itensPaginados = mockData.slice(startIndex, endIndex);

    return of({ itens: itensPaginados, totalItens: totalItens });
  }

  excluir(id: number): Observable<ResponseGeneric> {
    return of({ success: true, message: 'Equipamento excluído com sucesso' });
  }

  exportarExcel(filtros: EquipamentoFiltro): Observable<any> {
    return of({ data: 'excel data' });
  }
}
