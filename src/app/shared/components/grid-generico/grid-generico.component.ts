import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  computed,
  signal,
  effect,
  input,
  output,
  afterNextRender,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// =============================================================================
// SERVIÇO DE TRADUÇÃO PARA PAGINADOR
// =============================================================================
export class PaginadorPortugues extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0) {
      return 'Nenhum item';
    }
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    // Se só tem uma página, não mostrar range
    if (length <= pageSize) {
      return '';
    }

    return `${startIndex + 1}-${endIndex} de ${length}`;
  };
}

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================
export interface ColunaConfig {
  nome: string;
  largura?: string; // Ex: '15%', '200px', 'auto'
  larguraMinima?: string; // Ex: '120px'
  alinhamento?: 'left' | 'center' | 'right';
}

export interface GridDados<T = unknown> {
  itens: T[];
  totalItens: number;
}

export interface GridConfig {
  itensPorPagina: number;
  paginaAtual: number;
  mostrarPaginacao: boolean;
  mostrarOrdenacao: boolean;
  densidade: 'compact' | 'comfortable' | 'spacious';
  colunas?: ColunaConfig[]; // Configuração opcional das colunas
}

@Component({
  selector: 'app-grid-generico',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPortugues }],
  templateUrl: './grid-generico.component.html',
  styleUrls: ['./grid-generico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridGenericoComponent<T = unknown> implements OnInit, OnDestroy {
  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // =============================================================================
  // INPUTS MODERNOS (SIGNALS)
  // =============================================================================
  readonly colunas = input.required<string[]>();
  readonly nomesColunas = input<Record<string, string>>({});
  readonly dadosObservable = input.required<Observable<GridDados<T>>>();
  readonly acoesTemplate = input<TemplateRef<{ $implicit: T }>>();
  readonly carregando = input<boolean>(false);
  readonly config = input<Partial<GridConfig>>({});

  // =============================================================================
  // OUTPUTS MODERNOS
  // =============================================================================
  readonly mudancaPagina = output<PageEvent>();
  readonly ordenacaoMudou = output<{
    coluna: string;
    direcao: 'asc' | 'desc';
  }>();
  readonly linhaSelecionada = output<T>();

  // =============================================================================
  // SIGNALS DE ESTADO
  // =============================================================================
  private readonly dadosSignal = signal<GridDados<T>>({
    itens: [],
    totalItens: 0,
  });
  private readonly carregandoInterno = signal<boolean>(false);
  private readonly erroSignal = signal<string | null>(null);
  private readonly paginaAtualSignal = signal<number>(0);

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================
  readonly dados = computed(() => this.dadosSignal());
  readonly estaCarregando = computed(
    () => this.carregando() || this.carregandoInterno()
  );
  readonly temErro = computed(() => this.erroSignal() !== null);
  readonly erro = computed(() => this.erroSignal());

  readonly configCompleta = computed<GridConfig>(() => ({
    itensPorPagina: 10,
    paginaAtual: 0,
    mostrarPaginacao: true,
    mostrarOrdenacao: true,
    densidade: 'comfortable',
    ...this.config(),
  }));

  readonly colunasComAcoes = computed(() => {
    const colunas = this.colunas();
    return this.acoesTemplate() ? [...colunas, 'acoes'] : colunas;
  });

  readonly dataSource = computed(() => {
    const dados = this.dados();
    const dataSource = new MatTableDataSource<T>(dados.itens);

    // Configurar ordenação se disponível (será configurado no ngAfterViewInit)
    return dataSource;
  });

  readonly temDados = computed(() => this.dados().itens.length > 0);
  readonly totalItens = computed(() => this.dados().totalItens);
  readonly paginaAtual = computed(() => this.paginaAtualSignal());

  readonly configColunas = computed(() => {
    const config = this.configCompleta();
    const colunas = this.colunas();

    // Se há configuração personalizada, usar ela
    if (config.colunas && config.colunas.length > 0) {
      return config.colunas;
    }

    // Senão, criar configuração padrão baseada no número de colunas
    const temAcoes = this.acoesTemplate() !== undefined;

    return this.criarConfiguracaoPadrao(colunas, temAcoes);
  });

  readonly estilosColunas = computed(() => {
    const configColunas = this.configColunas();
    const estilos: Record<string, Record<string, string>> = {};

    configColunas.forEach((config, index) => {
      const seletor = `nth-child(${index + 1})`;
      estilos[seletor] = {
        width: config.largura || 'auto',
        minWidth: config.larguraMinima || 'auto',
        textAlign: config.alinhamento || 'left',
      };
    });

    return estilos;
  });

  readonly classesTabela = computed(() => {
    const densidade = this.configCompleta().densidade;
    return {
      'grid-compact': densidade === 'compact',
      'grid-comfortable': densidade === 'comfortable',
      'grid-spacious': densidade === 'spacious',
      'grid-carregando': this.estaCarregando(),
    };
  });

  // =============================================================================
  // PROPRIEDADES PRIVADAS
  // =============================================================================
  private readonly destroy$ = new Subject<void>();

  // =============================================================================
  // EFFECTS
  // =============================================================================
  private readonly dadosEffect = effect(
    () => {
      const observable = this.dadosObservable();
      this.inicializarDados(observable);
    },
    { allowSignalWrites: true }
  );

  // =============================================================================
  // LIFECYCLE
  // =============================================================================
  constructor() {
    // Configurar sort após a view estar renderizada
    afterNextRender(() => {
      if (this.sort) {
        const ds = this.dataSource();
        if (ds) {
          ds.sort = this.sort;
        }
      }
    });
  }

  ngOnInit(): void {
    this.configurarPaginacao();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================================================
  // MÉTODOS PÚBLICOS
  // =============================================================================
  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtualSignal.set(evento.pageIndex);
    this.mudancaPagina.emit(evento);
    this.salvarEstadoPaginacao(evento);
  }

  aoMudarOrdenacao(coluna: string, direcao: 'asc' | 'desc'): void {
    this.ordenacaoMudou.emit({ coluna, direcao });
  }

  aoSelecionarLinha(item: T): void {
    this.linhaSelecionada.emit(item);
  }

  obterValorColuna(item: T, coluna: string): unknown {
    return item[coluna as keyof T];
  }

  obterNomeColuna(coluna: string): string {
    const nomes = this.nomesColunas();
    return nomes[coluna] || this.formatarNomeColuna(coluna);
  }

  obterTotalPaginas(): number {
    const total = this.totalItens();
    const porPagina = this.configCompleta().itensPorPagina;
    return Math.ceil(total / porPagina);
  }

  obterEstilosColuna(coluna: string, index: number): Record<string, string> {
    const configColunas = this.configColunas();
    const config = configColunas[index];

    if (!config) return {};

    return {
      width: config.largura || 'auto',
      'min-width': config.larguraMinima || 'auto',
      'text-align': config.alinhamento || 'left',
    };
  }

  // =============================================================================
  // TRACK BY FUNCTIONS (PERFORMANCE)
  // =============================================================================
  trackByColuna = (index: number, coluna: string): string => coluna;

  trackByItem = (index: number, item: T): unknown => {
    // Tenta usar 'id' se existir, senão usa o índice
    return (item as Record<string, unknown>)['id'] ?? index;
  };

  // =============================================================================
  // MÉTODOS PRIVADOS
  // =============================================================================
  private inicializarDados(observable: Observable<GridDados<T>>): void {
    this.carregandoInterno.set(true);
    this.erroSignal.set(null);

    observable
      .pipe(
        takeUntil(this.destroy$),
        catchError((erro) => {
          console.error('Erro ao carregar dados do grid:', erro);
          this.erroSignal.set('Erro ao carregar dados. Tente novamente.');
          return of({ itens: [], totalItens: 0 });
        })
      )
      .subscribe({
        next: (dados) => {
          this.dadosSignal.set(dados);
          this.carregandoInterno.set(false);
        },
        error: () => {
          this.erroSignal.set('Erro inesperado ao carregar dados.');
          this.carregandoInterno.set(false);
        },
      });
  }

  private configurarPaginacao(): void {
    const paginaStorage = localStorage.getItem('grid-pagina-atual');
    if (paginaStorage && this.paginator) {
      const pagina = parseInt(paginaStorage, 10);
      if (!isNaN(pagina) && pagina >= 0) {
        this.paginator.pageIndex = pagina;
        this.paginaAtualSignal.set(pagina);
      }
    }
  }

  private salvarEstadoPaginacao(evento: PageEvent): void {
    localStorage.setItem('grid-pagina-atual', evento.pageIndex.toString());
  }

  private formatarNomeColuna(coluna: string): string {
    return coluna
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  private criarConfiguracaoPadrao(
    colunas: string[],
    temAcoes: boolean
  ): ColunaConfig[] {
    const config: ColunaConfig[] = [];
    colunas.forEach((nome) => {
      config.push({
        nome,
        alinhamento: 'left',
        largura: 'auto',
        larguraMinima: '150px', // Largura mínima mais generosa para desktop
      });
    });
    if (temAcoes) {
      config.push({
        nome: 'acoes',
        alinhamento: 'center',
        largura: '140px', // Mais espaço para ações em desktop
        larguraMinima: '140px',
      });
    }
    return config;
  }
}
