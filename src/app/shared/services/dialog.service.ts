import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DadosDialog } from '../models/dados-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  confirmar(dados: DadosDialog): Observable<boolean> {
    // Stub implementation - in a real app this would show a dialog
    return of(confirm(`${dados.title}\n\n${dados.content}`));
  }
}
