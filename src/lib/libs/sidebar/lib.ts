/* eslint-disable import/no-cycle */
import { createSidebarStorage, INITIAL_SIDEBAR } from '.';
import { createGameStorage, INITIAL_SAVED_GAMES } from '../game';
import { SidebarState } from './types';

export function loadSidebar() {
  const sidebarStorage = createSidebarStorage();
  const gameStorage = createGameStorage();

  const sidebar = sidebarStorage.get() || INITIAL_SIDEBAR;
  const games = gameStorage.getAll() || INITIAL_SAVED_GAMES;

  return { ...sidebar, games };
}

export function saveSidebar(updated: SidebarState) {
  const storage = createSidebarStorage();

  return storage.set(updated);
}
