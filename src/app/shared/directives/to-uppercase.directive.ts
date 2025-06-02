import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToUppercase]',
  standalone: true,
})
export class ToUppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    input.value = value;

    // Dispara evento input para atualizar o FormControl
    input.dispatchEvent(new Event('input'));
  }
}
