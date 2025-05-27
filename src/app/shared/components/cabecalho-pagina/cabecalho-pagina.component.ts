import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabecalho-pagina',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cabecalho-pagina">
      <h1>{{ titulo }}</h1>
    </div>
  `,
  styles: [
    `
      .cabecalho-pagina {
        padding: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid #ddd;
      }

      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: #333;
      }
    `,
  ],
})
export class CabecalhoPaginaComponent {
  @Input() titulo: string = '';
}
