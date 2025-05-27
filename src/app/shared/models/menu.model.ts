export interface MenuItem {
  icon: string;
  permission: string;
  routerLink: any;
  tooltip: string;
  subMenuItem: SubMenuItem[];
}

export interface SubMenuItem {
  icon: string;
  permission: string;
  routerLink: any;
  tooltip: string;
}
