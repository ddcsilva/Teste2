export type TipoInput =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url';

export type TamanhoInput = 'pequeno' | 'medio' | 'grande';

export type AparenciaInput = 'outline' | 'fill';

export interface ConfiguracaoTooltipInput {
  texto: string;
  posicao?: 'above' | 'below' | 'left' | 'right';
  delay?: number;
}

export interface OpcaoSelect {
  valor: any;
  texto: string;
  desabilitado?: boolean;
}
