import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { EquipamentoService } from '../../services/equipamento.service';
import { GridService } from '../../../../shared/services/grid.service';
import { Router } from '@angular/router';
import { EquipamentoFiltro } from '../../models/equipamento-filtro.model';
import { Equipamento } from '../../models/equipamento.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { FiltrosComponent } from '../../../../shared/components/filtros/filtros.component';
import {
  FiltroCampo,
  FiltroBotoes,
} from '../../../../shared/components/filtros/models';
import {
  GridGenericoComponent,
  GridConfig,
} from '../../../../shared/components/grid-generico/grid-generico.component';

@Component({
  selector: 'app-equipamento-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CabecalhoPaginaComponent,
    FiltrosComponent,
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

  // =============================================================================
  // CONFIGURAÇÃO DO GRID MODERNIZADO
  // =============================================================================
  readonly gridConfig: Partial<GridConfig> = {
    itensPorPagina: 10,
    paginaAtual: 0,
    mostrarPaginacao: true,
    mostrarOrdenacao: true,
    densidade: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
    colunas: [
      {
        nome: 'codigo',
        largura: '15%',
        larguraMinima: '140px',
        alinhamento: 'left',
      },
      {
        nome: 'categoria',
        largura: '25%',
        larguraMinima: '180px',
        alinhamento: 'left',
      },
      {
        nome: 'localizacao',
        largura: '45%',
        larguraMinima: '250px',
        alinhamento: 'left',
      },
      {
        nome: 'acoes',
        largura: '15%',
        larguraMinima: '140px',
        alinhamento: 'center',
      },
    ],
  };

  // =============================================================================
  // CONFIGURAÇÃO DOS FILTROS
  // =============================================================================
  readonly camposFiltroEquipamentos: FiltroCampo[] = [
    {
      nome: 'codigo',
      label: 'Código',
      tipo: 'text',
      placeholder: 'Digite o código do equipamento',
    },
    {
      nome: 'categoria',
      label: 'Categoria',
      tipo: 'text',
      placeholder: 'Digite a categoria',
    },
    {
      nome: 'localizacao',
      label: 'Localização',
      tipo: 'text',
      placeholder: 'Digite a localização',
    },
  ];

  readonly botoesConfigEquipamentos: FiltroBotoes = {
    exportar: {
      habilitado: true,
      texto: 'Exportar',
      icone: 'file_download',
      cor: 'accent',
      tooltip: 'Exportar dados para Excel',
    },
    limpar: {
      habilitado: true,
      texto: 'Limpar',
      icone: 'clear',
      cor: 'secondary',
      tooltip: 'Limpar todos os filtros',
    },
    pesquisar: {
      habilitado: true,
      texto: 'Pesquisar',
      icone: 'search',
      cor: 'primary',
      tooltip: 'Buscar equipamentos',
    },
    incluir: {
      habilitado: true,
      texto: 'Incluir',
      icone: 'add',
      cor: 'primary',
      tooltip: 'Adicionar novo equipamento',
    },
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

  carregarDados(paginaAtual = 0, itensPorPagina = 10): void {
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
    this.carregarDados(evento.pageIndex, evento.pageSize);
  }

  // =============================================================================
  // NOVOS MÉTODOS PARA GRID MODERNIZADO
  // =============================================================================
  aoMudarOrdenacao(evento: { coluna: string; direcao: SortDirection }): void {
    console.log('Ordenação alterada:', evento);
    // Aqui você pode implementar ordenação server-side
    // this.carregarDados(1, this.gridConfig.itensPorPagina, evento);
  }

  aoSelecionarLinha(equipamento: Equipamento): void {
    console.log('Linha selecionada:', equipamento);
    // Implementar ação de seleção se necessário
    // this.router.navigate([`/equipamentos/detalhes/${equipamento.id}`]);
  }

  buscar(valores: Record<string, unknown>): void {
    const filtros: EquipamentoFiltro = {
      codigo: (valores['codigo'] as string) || '',
      categoria: (valores['categoria'] as string) || '',
      localizacao: (valores['localizacao'] as string) || '',
    };
    this.filtrosSubject.next(filtros);
    this.carregarDados();
  }

  limpar(): void {
    this.filtrosSubject.next({ codigo: '', categoria: '', localizacao: '' });
    this.carregarDados();
  }

  editar(equipamento: Equipamento): void {
    this.router.navigate([
      `/cadastrosBasicos/equipamentos/editar/${equipamento.id}`,
    ]);
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

  incluir(): void {
    this.router.navigate(['/cadastrosBasicos/equipamentos/incluir']);
  }

  exportarExcel(): void {
    this.gridService.exportarDadosParaExcel(
      () => this.equipamentoService.exportarExcel(this.filtrosSubject.value),
      'Equipamentos'
    );
  }
}
