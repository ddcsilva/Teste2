export type TamanhoAutocomplete = 'pequeno' | 'medio' | 'grande';

export type AparenciaAutocomplete = 'outline' | 'fill';

export interface ConfiguracaoTooltipAutocomplete {
  texto: string;
  posicao?: 'above' | 'below' | 'left' | 'right';
  delay?: number;
}

export interface OpcaoAutocomplete {
  id: any;
  nome: string;
  desabilitado?: boolean;
}
