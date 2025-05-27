import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltrosComponent } from '../../../../shared/components/filtros/filtros.component';
import { FiltroBotoesComponent } from '../../../../shared/components/filtro-botoes/filtro-botoes.component';
import { SuportePlataformaFiltro } from '../../models/suporte-plataforma-filtro.model';

@Component({
  selector: 'app-suporte-plataforma-filtros',
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
          <mat-label>Suporte</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.suporte"
            placeholder="Digite o código do suporte"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Plataforma</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.plataforma"
            placeholder="Digite o código da plataforma"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Posição</mat-label>
          <input
            matInput
            [(ngModel)]="filtros.posicao"
            placeholder="Digite a posição"
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
export class SuportePlataformaFiltrosComponent {
  @Output() buscar = new EventEmitter<SuportePlataformaFiltro>();
  @Output() limpar = new EventEmitter<void>();

  filtros: SuportePlataformaFiltro = {
    suporte: '',
    plataforma: '',
    posicao: '',
  };

  onBuscar(): void {
    this.buscar.emit({ ...this.filtros });
  }

  onLimpar(): void {
    this.filtros = {
      suporte: '',
      plataforma: '',
      posicao: '',
    };
    this.limpar.emit();
  }
}
