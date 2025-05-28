import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { BotaoComponent } from '../../ui/botao/botao.component';
import {
  FiltroCampo,
  FiltroBotoes,
  FiltroBotaoConfig,
  FiltroEventos,
} from './models';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BotaoComponent,
  ],
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosComponent implements OnInit, OnDestroy {
  // =============================================================================
  // INPUTS
  // =============================================================================
  @Input() titulo = 'Filtros';
  @Input() expandido = true;
  @Input() campos: FiltroCampo[] = [];
  @Input() botoes: FiltroBotoes = {
    exportar: true,
    limpar: true,
    pesquisar: true,
    incluir: true,
  };
  @Input() valoresIniciais: Record<string, any> = {};
  @Input() carregando = false;
  @Input() autoFiltrar = false; // Filtrar automaticamente ao digitar
  @Input() debounceTime = 500; // Tempo de debounce para auto-filtrar

  // =============================================================================
  // OUTPUTS
  // =============================================================================
  @Output() filtrar = new EventEmitter<Record<string, any>>();
  @Output() limpar = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();

  // =============================================================================
  // PROPRIEDADES
  // =============================================================================
  formulario!: FormGroup;
  private readonly destroy$ = new Subject<void>();

  // Signals para reatividade
  private readonly carregandoSignal = signal(false);
  readonly estaCarregando = this.carregandoSignal.asReadonly();

  // Computed para organização dos campos em grid responsivo
  readonly camposOrganizados = computed(() => {
    const campos = this.campos;
    const linhas: FiltroCampo[][] = [];

    for (let i = 0; i < campos.length; i += 4) {
      linhas.push(campos.slice(i, i + 4));
    }

    return linhas;
  });

  // Computed para configuração dos botões
  readonly botoesConfig = computed(() => {
    const config = this.botoes;
    return {
      exportar: this.normalizarBotaoConfig(config.exportar, {
        texto: 'Exportar',
        icone: 'file_download',
        cor: 'accent' as const,
      }),
      limpar: this.normalizarBotaoConfig(config.limpar, {
        texto: 'Limpar',
        icone: 'clear',
        cor: 'secondary' as const,
      }),
      pesquisar: this.normalizarBotaoConfig(config.pesquisar, {
        texto: 'Pesquisar',
        icone: 'search',
        cor: 'primary' as const,
      }),
      incluir: this.normalizarBotaoConfig(config.incluir, {
        texto: 'Incluir',
        icone: 'add',
        cor: 'primary' as const,
      }),
    };
  });

  constructor(private fb: FormBuilder) {}

  // =============================================================================
  // LIFECYCLE
  // =============================================================================
  ngOnInit(): void {
    this.criarFormulario();
    this.configurarAutoFiltrar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================================================
  // MÉTODOS PÚBLICOS
  // =============================================================================
  onFiltrar(): void {
    if (this.formulario.valid) {
      const valores = this.formulario.value;
      this.filtrar.emit(valores);
    }
  }

  onLimpar(): void {
    this.formulario.reset();
    this.limpar.emit();
  }

  onIncluir(): void {
    this.incluir.emit();
  }

  onExportar(): void {
    this.exportar.emit();
  }

  // =============================================================================
  // MÉTODOS PRIVADOS
  // =============================================================================
  private criarFormulario(): void {
    const controles: Record<string, any> = {};

    this.campos.forEach((campo) => {
      const valorInicial = this.valoresIniciais[campo.nome] || '';
      controles[campo.nome] = [
        { value: valorInicial, disabled: campo.desabilitado },
      ];
    });

    this.formulario = this.fb.group(controles);
  }

  private configurarAutoFiltrar(): void {
    if (this.autoFiltrar) {
      this.formulario.valueChanges
        .pipe(
          debounceTime(this.debounceTime),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.onFiltrar();
        });
    }
  }

  private normalizarBotaoConfig(
    config: boolean | FiltroBotaoConfig | undefined,
    padrao: Partial<FiltroBotaoConfig>
  ): FiltroBotaoConfig | null {
    if (config === false || config === undefined) {
      return null;
    }

    if (config === true) {
      return {
        habilitado: true,
        ...padrao,
      } as FiltroBotaoConfig;
    }

    return {
      ...padrao,
      ...config,
    } as FiltroBotaoConfig;
  }

  // =============================================================================
  // HELPERS PARA TEMPLATE
  // =============================================================================
  obterClassesCampo(campo: FiltroCampo): string {
    const classes = ['filtro-campo'];

    if (campo.classe) {
      classes.push(campo.classe);
    }

    return classes.join(' ');
  }

  obterTipoCampo(campo: FiltroCampo): string {
    switch (campo.tipo) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  }

  // =============================================================================
  // TRACK BY FUNCTIONS
  // =============================================================================
  trackByIndex(index: number): number {
    return index;
  }

  trackByCampo(index: number, campo: FiltroCampo): string {
    return campo.nome;
  }

  trackByOpcao(index: number, opcao: any): any {
    return opcao.valor;
  }
}
