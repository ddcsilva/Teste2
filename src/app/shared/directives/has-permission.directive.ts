import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appHasPermission(permission: string) {
    // Por enquanto, sempre mostra o elemento (simulação)
    // Em um cenário real, verificaria as permissões do usuário
    const hasPermission = this.checkPermission(permission);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(permission: string): boolean {
    // Simulação: sempre retorna true
    // Em um cenário real, verificaria contra as permissões do usuário logado
    return true;
  }
}
