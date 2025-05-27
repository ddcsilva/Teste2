export type VarianteBotao =
  | 'primary'
  | 'accent'
  | 'danger'
  | 'secondary'
  | 'warning';

export type TamanhoBotao = 'pequeno' | 'medio' | 'grande';

export type TipoBotao = 'button' | 'submit' | 'reset';

export type IconePosicao = 'esquerda' | 'direita';

export interface ConfiguracaoTooltip {
  texto: string;
  posicao?: 'before' | 'after' | 'above' | 'below' | 'left' | 'right';
  delay?: number;
}
