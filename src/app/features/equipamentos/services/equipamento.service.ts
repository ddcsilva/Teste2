import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';
import { EquipamentoFiltro } from '../models/equipamento-filtro.model';
import { ResponseGeneric } from '../../../core/models/response-generic';

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  private readonly apiUrl = 'http://localhost:3001/api/v1';

  constructor(private http: HttpClient) {}

  obterDadosParaGrid(
    paginaAtual: number,
    itensPorPagina: number,
    codigo?: string,
    categoria?: string,
    localizacao?: string
  ): Observable<{ itens: Equipamento[]; totalItens: number }> {
    let params = new HttpParams()
      .set('_page', (paginaAtual + 1).toString()) // JSON Server usa 1-based
      .set('_per_page', itensPorPagina.toString());

    // Aplicar filtros se fornecidos
    if (codigo && codigo.trim()) {
      params = params.set('codigo_like', codigo.trim());
    }
    if (categoria && categoria.trim()) {
      params = params.set('categoria_like', categoria.trim());
    }
    if (localizacao && localizacao.trim()) {
      params = params.set('localizacao_like', localizacao.trim());
    }

    return this.http
      .get<{
        data: Equipamento[];
        first: number;
        items: number;
        last: number;
        next: number | null;
        pages: number;
        prev: number | null;
      }>(`${this.apiUrl}/equipamentos`, { params })
      .pipe(
        map((response) => ({
          itens: response.data || [],
          totalItens: response.items || 0,
        })),
        catchError((error) => {
          console.error('Erro ao buscar equipamentos:', error);
          return of({ itens: [], totalItens: 0 });
        })
      );
  }

  obterPorId(id: number): Observable<Equipamento | null> {
    return this.http.get<Equipamento>(`${this.apiUrl}/equipamentos/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar equipamento por ID:', error);
        return of(null);
      })
    );
  }

  criar(equipamento: Omit<Equipamento, 'id'>): Observable<Equipamento> {
    const novoEquipamento = {
      ...equipamento,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };

    return this.http
      .post<Equipamento>(`${this.apiUrl}/equipamentos`, novoEquipamento)
      .pipe(
        catchError((error) => {
          console.error('Erro ao criar equipamento:', error);
          throw error;
        })
      );
  }

  atualizar(
    id: number,
    equipamento: Partial<Equipamento>
  ): Observable<Equipamento> {
    const equipamentoAtualizado = {
      ...equipamento,
      dataAtualizacao: new Date().toISOString(),
    };

    return this.http
      .put<Equipamento>(
        `${this.apiUrl}/equipamentos/${id}`,
        equipamentoAtualizado
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar equipamento:', error);
          throw error;
        })
      );
  }

  excluir(id: number): Observable<ResponseGeneric> {
    return this.http.delete(`${this.apiUrl}/equipamentos/${id}`).pipe(
      map(() => ({
        success: true,
        message: 'Equipamento excluído com sucesso',
      })),
      catchError((error) => {
        console.error('Erro ao excluir equipamento:', error);
        return of({
          success: false,
          message: 'Erro ao excluir equipamento',
        });
      })
    );
  }

  exportarExcel(filtros: EquipamentoFiltro): Observable<Blob> {
    let params = new HttpParams();

    if (filtros.codigo && filtros.codigo.trim()) {
      params = params.set('codigo_like', filtros.codigo.trim());
    }
    if (filtros.categoria && filtros.categoria.trim()) {
      params = params.set('categoria_like', filtros.categoria.trim());
    }
    if (filtros.localizacao && filtros.localizacao.trim()) {
      params = params.set('localizacao_like', filtros.localizacao.trim());
    }

    // Para simulação, retornamos os dados como JSON
    // Em uma API real, isso retornaria um arquivo Excel
    return this.http
      .get<Equipamento[]>(`${this.apiUrl}/equipamentos`, { params })
      .pipe(
        map((equipamentos) => {
          const jsonData = JSON.stringify(equipamentos, null, 2);
          return new Blob([jsonData], { type: 'application/json' });
        }),
        catchError((error) => {
          console.error('Erro ao exportar equipamentos:', error);
          return of(new Blob(['[]'], { type: 'application/json' }));
        })
      );
  }

  // Métodos auxiliares para outras entidades
  obterCategorias(): Observable<{ id: number; nome: string }[]> {
    return this.http
      .get<{ id: number; nome: string }[]>(`${this.apiUrl}/categorias`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar categorias:', error);
          return of([]);
        })
      );
  }

  obterLocalizacoes(): Observable<{ codigo: string; nome: string }[]> {
    return this.http
      .get<{ codigo: string; nome: string }[]>(`${this.apiUrl}/localizacoes`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar localizações:', error);
          return of([]);
        })
      );
  }

  obterUsuarios(): Observable<{ id: number; nome: string }[]> {
    return this.http
      .get<{ id: number; nome: string }[]>(`${this.apiUrl}/usuarios`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar usuários:', error);
          return of([]);
        })
      );
  }
}
