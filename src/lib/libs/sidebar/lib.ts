/* eslint-disable import/no-cycle */
import { createSidebarStorage } from '.';
import { SidebarState } from './types';

export function loadSidebar() {
  const storage = createSidebarStorage();

  return storage.get();
}

export function saveSidebar(updated: SidebarState) {
  const storage = createSidebarStorage();

  return storage.set(updated);
}
