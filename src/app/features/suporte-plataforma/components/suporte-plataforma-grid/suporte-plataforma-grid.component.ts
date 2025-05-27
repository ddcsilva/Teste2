import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SuportePlataformaService } from '../../services/suporte-plataforma.service';
import { GridService } from '../../../../shared/services/grid.service';
import { Router } from '@angular/router';
import { SuportePlataformaFiltro } from '../../models/suporte-plataforma-filtro.model';
import { SuportePlataforma } from '../../models/suporte-plataforma.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { SuportePlataformaFiltrosComponent } from '../suporte-plataforma-filtros/suporte-plataforma-filtros.component';
import { GridGenericoComponent } from '../../../../shared/components/grid-generico/grid-generico.component';

@Component({
  selector: 'app-suporte-plataforma-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CabecalhoPaginaComponent,
    SuportePlataformaFiltrosComponent,
    GridGenericoComponent,
  ],
  templateUrl: './suporte-plataforma-grid.component.html',
  styleUrls: ['./suporte-plataforma-grid.component.scss'],
})
export class SuportePlataformaGridComponent implements OnInit, OnDestroy {
  colunas: string[] = ['codigoSuporte', 'codigoPlataforma', 'posicaoSuporte'];
  nomesColunas = {
    codigoSuporte: 'Suporte',
    codigoPlataforma: 'Plataforma',
    posicaoSuporte: 'Posição do Suporte',
  };

  filtrosSubject = new BehaviorSubject<SuportePlataformaFiltro>({
    suporte: '',
    plataforma: '',
    posicao: '',
  });
  dadosSubject = new BehaviorSubject<{
    itens: SuportePlataforma[];
    totalItens: number;
  }>({ itens: [], totalItens: 0 });
  dadosObservable = this.dadosSubject.asObservable();

  private unsubscribe$ = new Subject<void>();

  constructor(
    private suportePlataformaService: SuportePlataformaService,
    private gridService: GridService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  carregarDados(paginaAtual: number = 1, itensPorPagina: number = 10): void {
    this.suportePlataformaService
      .obterDadosParaGrid(
        paginaAtual,
        itensPorPagina,
        this.filtrosSubject.value.suporte,
        this.filtrosSubject.value.plataforma,
        this.filtrosSubject.value.posicao
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => this.dadosSubject.next(response));
  }

  aoMudarPagina(evento: PageEvent): void {
    this.carregarDados(evento.pageIndex + 1, evento.pageSize);
  }

  buscar(filtros: SuportePlataformaFiltro): void {
    this.filtrosSubject.next(filtros);
    this.carregarDados();
  }

  limpar(): void {
    this.filtrosSubject.next({ suporte: '', plataforma: '', posicao: '' });
    this.carregarDados();
  }

  editar(suporte: SuportePlataforma): void {
    this.router.navigate([
      `/cadastrosBasicos/suportePlataforma/update/${suporte.id}`,
    ]);
  }

  excluir(suporte: SuportePlataforma): void {
    this.gridService.confirmarEExcluir(
      {
        title: 'Confirmar Exclusão',
        content: `Tem certeza que deseja excluir o suporte ${suporte.codigoSuporte}?`,
      },
      suporte.id,
      (id: number) => this.suportePlataformaService.excluir(id),
      () => this.carregarDados(),
      {
        sucesso: `Suporte ${suporte.codigoSuporte} excluído com sucesso!`,
        erro: `Houve um erro ao excluir o suporte ${suporte.codigoSuporte}.`,
      }
    );
  }

  exportarExcel(): void {
    this.gridService.exportarDadosParaExcel(
      () =>
        this.suportePlataformaService.exportarExcel(this.filtrosSubject.value),
      'SuportesPlataformas'
    );
  }
}
