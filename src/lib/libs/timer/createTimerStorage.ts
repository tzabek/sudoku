import { ITimerStorage } from '.';
import { STORAGE } from '../shared';

/**
 * Creates a storage utility for managing timer-related data in the browser's localStorage.
 * This utility provides methods to get, set, and remove timer data.
 *
 * @method get
 * Retrieves the stored timer data from localStorage.
 *
 * @method set
 * Saves the provided timer data to localStorage.
 *
 * @method remove
 * Removes the stored timer data from localStorage.
 */
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
