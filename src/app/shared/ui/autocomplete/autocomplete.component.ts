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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatOptionModule } from '@angular/material/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TamanhoAutocomplete,
  AparenciaAutocomplete,
  ConfiguracaoTooltipAutocomplete,
  OpcaoAutocomplete,
} from './autocomplete.types';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  // Inputs
  tamanho = input<TamanhoAutocomplete>('medio');
  aparencia = input<AparenciaAutocomplete>('outline');
  label = input<string>('');
  placeholder = input<string>('');
  dica = input<string>('');
  obrigatorio = input<boolean>(false);
  desabilitado = input<boolean>(false);
  somenteLeitura = input<boolean>(false);
  larguraCompleta = input<boolean>(true);
  iconeEsquerda = input<string>();
  iconeDireita = input<string>();
  tooltip = input<string | ConfiguracaoTooltipAutocomplete>();

  // Específicos do autocomplete
  opcoes = input<OpcaoAutocomplete[]>([]);
  carregando = input<boolean>(false);
  minCaracteres = input<number>(3);
  debounceTime = input<number>(300);
  exibirFuncao = input<(item: any) => string>();
  mensagemSemResultados = input<string>('Nenhum resultado encontrado');
  mensagemCarregando = input<string>('Buscando...');

  // Outputs
  valorAlterado = output<any>();
  foco = output<Event>();
  desfoque = output<Event>();
  opcaoSelecionada = output<any>();
  busca = output<string>();

  // Estado interno
  private _valor = signal<any>('');
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  // Computeds simplificados
  valor = computed(() => this._valor());

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
    const value = target.value;

    if (typeof value === 'string') {
      this._valor.set(value);
      this._onChange(value);
      this.valorAlterado.emit(value);

      if (value.length >= this.minCaracteres()) {
        this.busca.emit(value);
      }
    }
  }

  onFocus(event: Event): void {
    this.foco.emit(event);
  }

  onBlur(event: Event): void {
    this._onTouched();
    this.desfoque.emit(event);
  }

  onOpcaoSelecionada(event: any): void {
    const opcao = event.option.value;
    this._valor.set(opcao);
    this._onChange(opcao);
    this.valorAlterado.emit(opcao);
    this.opcaoSelecionada.emit(opcao);
  }

  exibirOpcao(opcao: any): string {
    if (this.exibirFuncao()) {
      return this.exibirFuncao()!(opcao);
    }
    return opcao && opcao.nome ? opcao.nome : '';
  }

  // Método para exibir o valor no input
  exibirValor(): string {
    const valor = this.valor();

    if (typeof valor === 'string') {
      return valor;
    }

    if (valor && typeof valor === 'object') {
      return this.exibirOpcao(valor);
    }

    return '';
  }
}
