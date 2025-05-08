import { ISidebarStorage } from '.';
import { STORAGE } from '../shared';

export default function createSidebarStorage(): ISidebarStorage {
  return {
    get() {
      try {
        const savedData = localStorage.getItem(STORAGE.SIDEBAR);

        return savedData ? JSON.parse(savedData) : null;
      } catch {
        return null;
      }
    },

    set(sidebar) {
      localStorage.setItem(STORAGE.SIDEBAR, JSON.stringify(sidebar));

      return sidebar;
    },
  };
}
