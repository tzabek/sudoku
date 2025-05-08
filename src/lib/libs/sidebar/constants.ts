import { SidebarState } from '.';

export const SIDEBAR_MENU = ['game', 'docs'] as const;

export const INITIAL_SIDEBAR_STATE: SidebarState = {
  isVisible: true,
  menu: {
    game: { isActive: true },
    docs: { isActive: false },
  },
};
