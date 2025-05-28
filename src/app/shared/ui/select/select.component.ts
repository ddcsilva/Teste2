import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  forwardRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TamanhoSelect,
  AparenciaSelect,
  ConfiguracaoTooltipSelect,
  OpcaoSelect,
} from './select.types';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  // Inputs
  tamanho = input<TamanhoSelect>('medio');
  aparencia = input<AparenciaSelect>('outline');
  label = input<string>('');
  placeholder = input<string>('');
  dica = input<string>('');
  obrigatorio = input<boolean>(false);
  desabilitado = input<boolean>(false);
  larguraCompleta = input<boolean>(true);
  iconeEsquerda = input<string>();
  iconeDireita = input<string>();
  tooltip = input<string | ConfiguracaoTooltipSelect>();
  opcoes = input<OpcaoSelect[]>([]);
  carregando = input<boolean>(false);
  textoCarregando = input<string>('Carregando...');
  textoVazio = input<string>('Nenhuma opção disponível');

  // Outputs
  valorAlterado = output<any>();
  foco = output<Event>();
  desfoque = output<Event>();

  // Estado interno
  private _valor = signal<any>('');
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  // Computeds
  valor = computed(() => this._valor());

  classesComputadas = computed(() => {
    return {
      'app-select': true,
      [`app-select--${this.tamanho()}`]: this.tamanho() !== 'medio',
      'app-select--full': this.larguraCompleta(),
      'app-select--com-icone-esquerda': !!this.iconeEsquerda(),
      'app-select--com-icone-direita': !!this.iconeDireita(),
      'app-select--desabilitado': this.desabilitado(),
      'app-select--carregando': this.carregando(),
    };
  });

  tooltipConfig = computed(() => {
    const tooltip = this.tooltip();
    if (typeof tooltip === 'string') {
      return { texto: tooltip, posicao: 'above' as const, delay: 500 };
    }
    return tooltip;
  });

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this._valor.set(value || '');
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // O estado desabilitado é controlado pelo input signal
  }

  // Event handlers
  onSelectionChange(value: any): void {
    this._valor.set(value);
    this._onChange(value);
    this.valorAlterado.emit(value);
  }

  onFocus(event: Event): void {
    this.foco.emit(event);
  }

  onBlur(event: Event): void {
    this._onTouched();
    this.desfoque.emit(event);
  }

  // Método para rastrear opções
  trackByOpcao(index: number, opcao: OpcaoSelect): any {
    return opcao.valor;
  }
}
