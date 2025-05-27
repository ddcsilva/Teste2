import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltrosComponent } from '../../../../shared/components/filtros/filtros.component';
import { EquipamentoFiltro } from '../../models/equipamento-filtro.model';
import { FiltroBotoesComponent } from '../../../../shared/components/filtro-botoes/filtro-botoes.component';

@Component({
  selector: 'app-equipamento-filtros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FiltrosComponent,
    FiltroBotoesComponent,
  ],
  template: `
    <app-filtros>
      <div class="filtros-container">
        <mat-form-field appearance="outline">
          <mat-label>Código</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.codigo"
            placeholder="Digite o código do equipamento"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoria</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.categoria"
            placeholder="Digite a categoria"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Localização</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.localizacao"
            placeholder="Digite a localização"
          />
        </mat-form-field>

        <app-filtro-botoes
          (pesquisar)="onBuscar()"
          (limpar)="onLimpar()"
        ></app-filtro-botoes>
      </div>
    </app-filtros>
  `,
  styles: [
    `
      .filtros-container {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: flex-end;
      }

      .filtros-container mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    `,
  ],
})
export class EquipamentoFiltrosComponent {
  @Output() buscar = new EventEmitter<EquipamentoFiltro>();
  @Output() limpar = new EventEmitter<void>();

  filtros: EquipamentoFiltro = {
    codigo: '',
    categoria: '',
    localizacao: '',
  };

  onBuscar(): void {
    this.buscar.emit({ ...this.filtros });
  }

  onLimpar(): void {
    this.filtros = {
      codigo: '',
      categoria: '',
      localizacao: '',
    };
    this.limpar.emit();
  }
}
