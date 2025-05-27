import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grid-generico',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
  ],
  templateUrl: './grid-generico.component.html',
  styleUrls: ['./grid-generico.component.scss'],
})
export class GridGenericoComponent<T> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() colunas: string[] = [];
  @Input() nomesColunas: { [key: string]: string } = {};
  @Input() dadosObservable!: Observable<{ itens: T[]; totalItens: number }>;
  @Input() acoesTemplate?: TemplateRef<{ $implicit: T }>;
  @Output() mudancaPagina = new EventEmitter<PageEvent>();
  @Output() exportar = new EventEmitter<void>();

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  totalItens = 0;
  itensPorPagina = 10;
  paginaAtual = 0;

  private unsubscribe$ = new Subject<void>();

  get colunasComAcoes(): string[] {
    return this.acoesTemplate ? [...this.colunas, 'Ações'] : this.colunas;
  }

  ngOnInit(): void {
    this.atualizaPaginacao();
    this.inicializarDados();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  atualizaPaginacao(): void {
    const paginaAtualStorage = localStorage.getItem('paginaAtual');
    if (paginaAtualStorage) {
      this.paginaAtual = +paginaAtualStorage - 1;
    }
  }

  aoMudarPagina(evento: PageEvent): void {
    this.mudancaPagina.emit(evento);
  }

  aoExportar(): void {
    this.exportar.emit();
  }

  rastrearPorColuna(index: number, coluna: string): string {
    return coluna;
  }

  private inicializarDados(): void {
    this.dadosObservable
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((erro) => {
          console.error(`Erro ao carregar dados: ${erro}`);
          return of({ itens: [], totalItens: 0 });
        })
      )
      .subscribe((resposta) =>
        this.atualizarDataSource(resposta.itens, resposta.totalItens)
      );
  }

  private atualizarDataSource(dados: T[], total: number): void {
    this.dataSource.data = dados;
    this.totalItens = total;
  }
}
