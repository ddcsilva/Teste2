import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuportePlataformaGridComponent } from '../components/suporte-plataforma-grid/suporte-plataforma-grid.component';

@Component({
  selector: 'app-suporte-plataforma',
  standalone: true,
  imports: [CommonModule, SuportePlataformaGridComponent],
  templateUrl: './suporte-plataforma.component.html',
  styleUrl: './suporte-plataforma.component.scss',
})
export class SuportePlataformaComponent {}
