// Constantes da aplicação
export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  },
  GRID: {
    DEFAULT_SORT_DIRECTION: 'asc',
    EXPORT_FILENAME_PREFIX: 'export_',
  },
  MESSAGES: {
    CONFIRM_DELETE: 'Tem certeza que deseja excluir este item?',
    SUCCESS_DELETE: 'Item excluído com sucesso!',
    ERROR_DELETE: 'Erro ao excluir item.',
    SUCCESS_EXPORT: 'Dados exportados com sucesso!',
    ERROR_EXPORT: 'Erro ao exportar dados.',
  },
  DEBOUNCE_TIME: 300,
} as const;
