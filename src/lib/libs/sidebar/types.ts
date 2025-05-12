/* eslint-disable import/no-cycle */
import { ReactNode } from 'react';
import { SIDEBAR_MENU } from '.';
import { SavedGames } from '../game';

export type SidebarMenu = (typeof SIDEBAR_MENU)[number];

export type SidebarProps = { children: ReactNode };

export type SidebarState = {
  id: string;
  isVisible: boolean;
  menu: { [K in SidebarMenu]: { isActive: boolean } };
  games: SavedGames;
};

export interface ISidebarStorage {
  get: () => SidebarState | null;
  set: (sidebar: SidebarState) => SidebarState;
}

export type SidebarActionProps =
  | { type: 'load-sidebar' }
  | { type: 'create-sidebar' }
  | { type: 'toggle-sidebar' }
  | { type: 'toggle-menu' };
