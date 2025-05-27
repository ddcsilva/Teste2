import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { EquipamentoService } from '../../services/equipamento.service';
import { GridService } from '../../../../shared/services/grid.service';
import { Router } from '@angular/router';
import { EquipamentoFiltro } from '../../models/equipamento-filtro.model';
import { Equipamento } from '../../models/equipamento.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { EquipamentoFiltrosComponent } from '../equipamento-filtros/equipamento-filtros.component';
import { GridGenericoComponent } from '../../../../shared/components/grid-generico/grid-generico.component';

@Component({
  selector: 'app-equipamento-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CabecalhoPaginaComponent,
    EquipamentoFiltrosComponent,
    GridGenericoComponent,
  ],
  templateUrl: './equipamento-grid.component.html',
  styleUrls: ['./equipamento-grid.component.scss'],
})
export class EquipamentoGridComponent implements OnInit, OnDestroy {
  colunas: string[] = ['codigo', 'categoria', 'localizacao'];
  nomesColunas = {
    codigo: 'Código',
    categoria: 'Categoria',
    localizacao: 'Localização',
  };

  filtrosSubject = new BehaviorSubject<EquipamentoFiltro>({
    codigo: '',
    categoria: '',
    localizacao: '',
  });
  dadosSubject = new BehaviorSubject<{
    itens: Equipamento[];
    totalItens: number;
  }>({ itens: [], totalItens: 0 });
  dadosObservable = this.dadosSubject.asObservable();

  private unsubscribe$ = new Subject<void>();

  constructor(
    private equipamentoService: EquipamentoService,
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
    this.equipamentoService
      .obterDadosParaGrid(
        paginaAtual,
        itensPorPagina,
        this.filtrosSubject.value.codigo,
        this.filtrosSubject.value.categoria,
        this.filtrosSubject.value.localizacao
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => this.dadosSubject.next(response));
  }

  aoMudarPagina(evento: PageEvent): void {
    this.carregarDados(evento.pageIndex + 1, evento.pageSize);
  }

  buscar(filtros: EquipamentoFiltro): void {
    this.filtrosSubject.next(filtros);
    this.carregarDados();
  }

  limpar(): void {
    this.filtrosSubject.next({ codigo: '', categoria: '', localizacao: '' });
    this.carregarDados();
  }

  editar(equipamento: Equipamento): void {
    this.router.navigate([`/equipamentos/editar/${equipamento.id}`]);
  }

  excluir(equipamento: Equipamento): void {
    this.gridService.confirmarEExcluir(
      {
        title: 'Confirmar Exclusão',
        content: `Tem certeza que deseja excluir o equipamento ${equipamento.codigo}?`,
      },
      equipamento.id,
      (id: number) => this.equipamentoService.excluir(id),
      () => this.carregarDados(),
      {
        sucesso: `Equipamento ${equipamento.codigo} excluído com sucesso!`,
        erro: `Houve um erro ao excluir o equipamento ${equipamento.codigo}.`,
      }
    );
  }

  exportarExcel(): void {
    this.gridService.exportarDadosParaExcel(
      () => this.equipamentoService.exportarExcel(this.filtrosSubject.value),
      'Equipamentos'
    );
  }
}
