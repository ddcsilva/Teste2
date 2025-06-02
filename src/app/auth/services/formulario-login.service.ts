import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormularioLoginService {
  campoInvalido(formulario: FormGroup, nomeCampo: string): boolean {
    const campo = formulario.get(nomeCampo);
    return !!(campo && campo.invalid && (campo.dirty || campo.touched));
  }

  formularioEhValido(formulario: FormGroup): boolean {
    return formulario.valid;
  }

  marcarCamposComoTocados(formulario: FormGroup): void {
    Object.keys(formulario.controls).forEach((key) => {
      formulario.get(key)?.markAsTouched();
    });
  }
}
