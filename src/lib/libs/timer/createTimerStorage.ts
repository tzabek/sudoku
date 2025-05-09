import { ITimerStorage } from '.';
import { STORAGE } from '../shared';

export default function createTimerStorage(): ITimerStorage {
  return {
    get() {
      try {
        const savedData = localStorage.getItem(STORAGE.TIMER);

        return savedData ? JSON.parse(savedData) : null;
      } catch {
        return null;
      }
    },

    set(timer) {
      localStorage.setItem(STORAGE.TIMER, JSON.stringify(timer));

      return timer;
    },

    remove() {
      localStorage.removeItem(STORAGE.TIMER);
    },
  };
}
