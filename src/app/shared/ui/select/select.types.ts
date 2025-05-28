export type TamanhoSelect = 'pequeno' | 'medio' | 'grande';

export type AparenciaSelect = 'outline' | 'fill';

export interface ConfiguracaoTooltipSelect {
  texto: string;
  posicao?: 'above' | 'below' | 'left' | 'right';
  delay?: number;
}

export interface OpcaoSelect {
  valor: any;
  texto: string;
  desabilitado?: boolean;
}
