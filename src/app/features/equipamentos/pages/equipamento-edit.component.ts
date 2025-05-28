import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

import { Equipamento } from '../models/equipamento.model';
import { EquipamentoService } from '../services/equipamento.service';
import { EquipamentoFormComponent } from '../components/equipamento-form/equipamento-form.component';

@Component({
  selector: 'app-equipamento-edit',
  standalone: true,
  imports: [EquipamentoFormComponent],
  template: `
    <app-equipamento-form
      [titulo]="'Editar Equipamento'"
      [botaoSubmit]="'Atualizar'"
      [codigoEquipamento]="equipamentoId"
      (formularioEnviado)="atualizar($event)"
    ></app-equipamento-form>
  `,
  styles: [],
})
export class EquipamentoEditComponent implements OnInit {
  equipamentoId: number | null = null;

  constructor(
    private equipamentoService: EquipamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.equipamentoId = Number(this.route.snapshot.paramMap.get('id'));
  }

  atualizar(equipamento: Equipamento): void {
    if (!this.equipamentoId) {
      this.snackBar.open('ID do equipamento não encontrado.', 'Fechar', {
        duration: 5000,
      });
      return;
    }

    this.equipamentoService
      .atualizar(this.equipamentoId, equipamento)
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar equipamento:', error);
          this.snackBar.open('Erro ao atualizar Equipamento.', 'Fechar', {
            duration: 5000,
          });
          return of(null);
        })
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.snackBar.open('Equipamento atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigate(['/cadastrosBasicos/equipamentos']);
        }
      });
  }
}
