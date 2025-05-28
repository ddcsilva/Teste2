export interface MenuItem {
  readonly icon: string;
  readonly permission: string;
  readonly routerLink: string;
  readonly tooltip: string;
  readonly subMenuItem: readonly SubMenuItem[];
}

export interface SubMenuItem {
  readonly icon?: string;
  readonly permission: string;
  readonly routerLink: string;
  readonly tooltip: string;
}
