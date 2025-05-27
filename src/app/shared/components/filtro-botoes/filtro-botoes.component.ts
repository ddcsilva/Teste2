import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotaoComponent } from '../botao/botao.component';

@Component({
  selector: 'app-filtro-botoes',
  standalone: true,
  imports: [CommonModule, BotaoComponent],
  templateUrl: './filtro-botoes.component.html',
  styleUrls: ['./filtro-botoes.component.scss'],
})
export class FiltroBotoesComponent {
  @Input() mostrarPesquisar = true;
  @Input() mostrarIncluir = true;
  @Input() mostrarLimpar = true;

  @Output() pesquisar = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<void>();
  @Output() limpar = new EventEmitter<void>();

  classesContainer = computed(() => {
    return { 'filtro-botoes-container': true };
  });
}
