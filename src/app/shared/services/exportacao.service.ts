import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportacaoService {
  exportarExcel<T>(
    funcaoExportar: () => Observable<T>,
    nomeArquivo: string
  ): void {
    // Stub implementation - in a real app this would handle Excel export
    console.log(`Exporting to Excel: ${nomeArquivo}`);
    funcaoExportar().subscribe((data) => {
      console.log('Data to export:', data);
    });
  }
}
