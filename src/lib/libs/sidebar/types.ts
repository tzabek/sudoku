/* eslint-disable import/no-cycle */
import { SIDEBAR_MENU } from '.';

export type SidebarMenu = (typeof SIDEBAR_MENU)[number];

export type SidebarState = {
  isVisible: boolean;
  menu: { [K in SidebarMenu]: { isActive: boolean } };
};

export interface ISidebarStorage {
  get: () => SidebarState | null;
  set: (sidebar: SidebarState) => SidebarState;
}

export type SidebarActionProps =
  | { type: 'load-sidebar' }
  | { type: 'toggle-sidebar' }
  | { type: 'toggle-menu' };
