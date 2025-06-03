import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  VarianteBotao,
  TamanhoBotao,
  TipoBotao,
  IconePosicao,
  ConfiguracaoTooltip,
} from './botao.types';

@Component({
  selector: 'app-botao',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './botao.component.html',
  styleUrl: './botao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotaoComponent {
  // Inputs
  variante = input<VarianteBotao>('primary');
  tamanho = input<TamanhoBotao>('medio');
  tipo = input<TipoBotao>('button');
  desabilitado = input<boolean>(false);
  carregando = input<boolean>(false);
  larguraCompleta = input<boolean>(false);
  ordem = input<number>();
  icone = input<string>();
  iconePosicao = input<IconePosicao>('esquerda');
  tooltip = input<string | ConfiguracaoTooltip>();

  // Outputs
  clicado = output<Event>();

  // Computeds
  classesComputadas = computed(() => {
    const mapeamentoVariantes = {
      primary: 'mat-primary',
      accent: 'mat-accent',
      danger: 'app-danger',
      secondary: 'app-secondary',
      warning: 'app-warning',
    };

    return {
      'app-botao': true,
      [mapeamentoVariantes[this.variante()]]: true,
      [`app-botao--${this.tamanho()}`]: this.tamanho() !== 'medio',
      'app-botao--full': this.larguraCompleta(),
      'app-botao--loading': this.carregando(),
      'app-botao--com-icone': !!this.icone(),
    };
  });

  tooltipConfig = computed(() => {
    const tooltip = this.tooltip();

    if (!tooltip) return null;

    if (typeof tooltip === 'string') {
      return {
        texto: tooltip,
        posicao: 'above' as const,
        delay: 500,
      } as ConfiguracaoTooltip;
    }

    return {
      texto: tooltip.texto,
      posicao: tooltip.posicao || ('above' as const),
      delay: tooltip.delay || 500,
    } as ConfiguracaoTooltip;
  });

  mostrarIconeEsquerda = computed(
    () => this.icone() && this.iconePosicao() === 'esquerda'
  );

  mostrarIconeDireita = computed(
    () => this.icone() && this.iconePosicao() === 'direita'
  );

  aoClicar(event: Event): void {
    if (this.desabilitado() || this.carregando()) {
      return;
    }

    this.clicado.emit(event);
  }
}
