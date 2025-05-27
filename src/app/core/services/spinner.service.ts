import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loading = signal<boolean>(false);

  isLoading = this.loading.asReadonly();

  show(): void {
    this.loading.set(true);
  }

  hide(): void {
    this.loading.set(false);
  }

  toggle(): void {
    this.loading.set(!this.loading());
  }
}
