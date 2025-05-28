import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

import { Equipamento } from '../models/equipamento.model';
import { EquipamentoService } from '../services/equipamento.service';
import { EquipamentoFormComponent } from '../components/equipamento-form/equipamento-form.component';

@Component({
  selector: 'app-equipamento-create',
  standalone: true,
  imports: [EquipamentoFormComponent],
  template: `
    <app-equipamento-form
      [titulo]="'Cadastrar Equipamento'"
      [botaoSubmit]="'Incluir'"
      (formularioEnviado)="criar($event)"
    ></app-equipamento-form>
  `,
  styles: [],
})
export class EquipamentoCreateComponent {
  constructor(
    private equipamentoService: EquipamentoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  criar(equipamento: Equipamento): void {
    this.equipamentoService
      .criar(equipamento)
      .pipe(
        catchError((error) => {
          console.error('Erro ao criar equipamento:', error);
          this.snackBar.open('Erro ao criar Equipamento.', 'Fechar', {
            duration: 5000,
          });
          return of(null);
        })
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.snackBar.open('Equipamento criado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigate(['/cadastrosBasicos/equipamentos']);
        }
      });
  }
}
