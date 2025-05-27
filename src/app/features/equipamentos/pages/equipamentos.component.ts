import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipamentoGridComponent } from '../components/equipamento-grid/equipamento-grid.component';

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [CommonModule, EquipamentoGridComponent],
  templateUrl: './equipamentos.component.html',
  styleUrl: './equipamentos.component.scss',
})
export class EquipamentosComponent {}
