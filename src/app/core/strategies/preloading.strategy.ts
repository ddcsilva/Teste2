import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // Preload apenas rotas marcadas com data.preload = true
    if (route.data && route.data['preload']) {
      // Delay de 2 segundos para não impactar o carregamento inicial
      return timer(2000).pipe(mergeMap(() => fn()));
    }

    // Não preload por padrão
    return of(null);
  }
}
