import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrosComponent } from '../../../../shared/components/filtros/filtros.component';
import {
  FiltroCampo,
  FiltroBotoes,
} from '../../../../shared/components/filtros/models';
import { EquipamentoFiltro } from '../../models/equipamento-filtro.model';

@Component({
  selector: 'app-equipamento-filtros',
  standalone: true,
  imports: [CommonModule, FiltrosComponent],
  template: `
    <app-filtros
      titulo="Filtros de Equipamentos"
      [campos]="camposFiltro"
      [botoes]="botoesConfig"
      [valoresIniciais]="valoresIniciais"
      [carregando]="carregando()"
      (filtrar)="onFiltrar($event)"
      (limpar)="onLimpar()"
      (incluir)="onIncluir()"
      (exportar)="onExportar()"
    ></app-filtros>
  `,
})
export class EquipamentoFiltrosComponent {
  // =============================================================================
  // OUTPUTS
  // =============================================================================
  @Output() buscar = new EventEmitter<EquipamentoFiltro>();
  @Output() limpar = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();

  // =============================================================================
  // CONFIGURAÇÃO DOS CAMPOS
  // =============================================================================
  readonly camposFiltro: FiltroCampo[] = [
    {
      nome: 'codigo',
      label: 'Código',
      tipo: 'text',
      placeholder: 'Digite o código do equipamento',
    },
    {
      nome: 'categoria',
      label: 'Categoria',
      tipo: 'text',
      placeholder: 'Digite a categoria',
    },
    {
      nome: 'localizacao',
      label: 'Localização',
      tipo: 'text',
      placeholder: 'Digite a localização',
    },
  ];

  // =============================================================================
  // CONFIGURAÇÃO DOS BOTÕES
  // =============================================================================
  readonly botoesConfig: FiltroBotoes = {
    exportar: {
      habilitado: true,
      texto: 'Exportar',
      icone: 'file_download',
      cor: 'accent',
      tooltip: 'Exportar dados para Excel',
    },
    limpar: {
      habilitado: true,
      texto: 'Limpar',
      icone: 'clear',
      cor: 'secondary',
      tooltip: 'Limpar todos os filtros',
    },
    pesquisar: {
      habilitado: true,
      texto: 'Pesquisar',
      icone: 'search',
      cor: 'primary',
      tooltip: 'Buscar equipamentos',
    },
    incluir: {
      habilitado: true,
      texto: 'Incluir',
      icone: 'add',
      cor: 'primary',
      tooltip: 'Adicionar novo equipamento',
    },
  };

  // =============================================================================
  // ESTADO
  // =============================================================================
  readonly valoresIniciais: EquipamentoFiltro = {
    codigo: '',
    categoria: '',
    localizacao: '',
  };

  // Signal para estado de carregamento
  readonly carregando = signal(false);

  // =============================================================================
  // MÉTODOS DE EVENTO
  // =============================================================================
  onFiltrar(valores: Record<string, any>): void {
    const filtros: EquipamentoFiltro = {
      codigo: valores['codigo'] || '',
      categoria: valores['categoria'] || '',
      localizacao: valores['localizacao'] || '',
    };

    this.buscar.emit(filtros);
  }

  onLimpar(): void {
    this.limpar.emit();
  }

  onIncluir(): void {
    this.incluir.emit();
  }

  onExportar(): void {
    this.exportar.emit();
  }

  // =============================================================================
  // MÉTODOS PÚBLICOS
  // =============================================================================
  definirCarregando(carregando: boolean): void {
    this.carregando.set(carregando);
  }
}
