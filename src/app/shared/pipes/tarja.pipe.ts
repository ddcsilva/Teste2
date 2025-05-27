import { Pipe, PipeTransform } from '@angular/core';
import { AmbienteService } from '../../core/services/ambiente.service';

@Pipe({
  name: 'tarja',
  standalone: true,
})
export class TarjaPipe implements PipeTransform {
  constructor(private ambienteService: AmbienteService) {}

  transform(value: string): string | null {
    const ambiente = this.ambienteService.obterAmbiente();
    if (ambiente) {
      return `${value}${ambiente}`;
    }
    return null;
  }
}
