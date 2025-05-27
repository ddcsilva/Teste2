// Utilitários de formatação
export class FormatUtils {
  /**
   * Formata data para exibição
   */
  static formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  /**
   * Formata data e hora para exibição
   */
  static formatDateTime(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('pt-BR');
  }

  /**
   * Formata número para moeda brasileira
   */
  static formatCurrency(value: number): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  /**
   * Formata número com separadores de milhares
   */
  static formatNumber(value: number): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  /**
   * Remove caracteres especiais de string
   */
  static removeSpecialChars(str: string): string {
    if (!str) return '';
    return str.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Capitaliza primeira letra de cada palavra
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}
