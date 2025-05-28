export interface FiltroBotoes {
  exportar?: boolean | FiltroBotaoConfig;
  limpar?: boolean | FiltroBotaoConfig;
  pesquisar?: boolean | FiltroBotaoConfig;
  incluir?: boolean | FiltroBotaoConfig;
}

export interface FiltroBotaoConfig {
  habilitado: boolean;
  texto?: string;
  icone?: string;
  cor?: 'primary' | 'accent' | 'danger' | 'secondary' | 'warning';
  desabilitado?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export interface FiltroEventos {
  filtrar?: (valores: Record<string, any>) => void;
  limpar?: () => void;
  incluir?: () => void;
  exportar?: () => void;
}
