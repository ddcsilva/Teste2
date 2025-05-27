import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabecalho-pagina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecalho-pagina.component.html',
  styleUrl: './cabecalho-pagina.component.scss',
})
export class CabecalhoPaginaComponent {
  @Input() titulo: string = '';
  @Input() compact: boolean = false;
  @Input() noBorder: boolean = false;

  get cssClasses(): string {
    const classes = ['cabecalho-pagina'];

    if (this.compact) {
      classes.push('cabecalho-pagina--compact');
    }

    if (this.noBorder) {
      classes.push('cabecalho-pagina--no-border');
    }

    return classes.join(' ');
  }
}
