export type TipoCampoFiltro =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'select'
  | 'autocomplete';

export interface OpcaoSelect {
  valor: any;
  texto: string;
  desabilitado?: boolean;
}

export interface FiltroCampo {
  nome: string;
  label: string;
  tipo: TipoCampoFiltro;
  placeholder?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  opcoes?: OpcaoSelect[]; // Para select/autocomplete
  mascara?: string; // Para formatação
  validacao?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  classe?: string; // Classes CSS adicionais
  dica?: string; // Tooltip/hint
}
