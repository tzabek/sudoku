/* eslint-disable import/no-cycle */
import { SidebarState } from '.';
import { INITIAL_SAVED_GAMES } from '../game';

export const SIDEBAR_MENU = ['game', 'docs'] as const;

export const INITIAL_SIDEBAR: SidebarState = {
  isVisible: true,
  menu: {
    game: { isActive: true },
    docs: { isActive: false },
  },
  games: INITIAL_SAVED_GAMES,
};
