import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensagensOperacao } from '../models/mensagens-operacao.model';

@Injectable({
  providedIn: 'root',
})
export class OperacaoService {
  executarOperacao<T>(
    tipo: string,
    operacao: () => Observable<T>,
    callback?: () => void,
    mensagens?: MensagensOperacao
  ): Observable<T> {
    // Stub implementation - in a real app this would handle the operation
    const result = operacao();
    if (callback) {
      callback();
    }
    return result;
  }
}
