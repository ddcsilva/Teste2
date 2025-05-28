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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TipoInput,
  TamanhoInput,
  AparenciaInput,
  ConfiguracaoTooltipInput,
  OpcaoSelect,
} from './input.types';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Inputs
  tipo = input<TipoInput>('text');
  tamanho = input<TamanhoInput>('medio');
  aparencia = input<AparenciaInput>('outline');
  label = input<string>('');
  placeholder = input<string>('');
  dica = input<string>('');
  obrigatorio = input<boolean>(false);
  desabilitado = input<boolean>(false);
  somenteLeitura = input<boolean>(false);
  larguraCompleta = input<boolean>(true);
  iconeEsquerda = input<string>();
  iconeDireita = input<string>();
  tooltip = input<string | ConfiguracaoTooltipInput>();

  // Para select
  opcoes = input<OpcaoSelect[]>([]);

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
      'app-input': true,
      [`app-input--${this.tamanho()}`]: this.tamanho() !== 'medio',
      'app-input--full': this.larguraCompleta(),
      'app-input--com-icone-esquerda': !!this.iconeEsquerda(),
      'app-input--com-icone-direita': !!this.iconeDireita(),
      'app-input--desabilitado': this.desabilitado(),
      'app-input--readonly': this.somenteLeitura(),
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
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = this.tipo() === 'number' ? +target.value : target.value;
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

  onSelectChange(value: any): void {
    this._valor.set(value);
    this._onChange(value);
    this.valorAlterado.emit(value);
  }
}
