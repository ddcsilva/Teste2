import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TratamentoErroService {
  tratarErro(mensagem: string, valorPadrao: any) {
    return (error: any): Observable<any> => {
      console.error(mensagem, error);
      return of(valorPadrao);
    };
  }
}
