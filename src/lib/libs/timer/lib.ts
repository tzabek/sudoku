/* eslint-disable import/no-cycle */
import {
  CreateTimerProps,
  createTimerStorage,
  INITIAL_TIMER,
  TimerState,
} from '.';

/**
 * Saves the current timer state to persistent storage.
 *
 * This function utilizes a timer storage mechanism to persist the provided
 * timer state. The storage is created using the `createTimerStorage` function,
 * and the state is saved using the storage's `set` method.
 */
export function saveTimer(state: TimerState) {
  const storage = createTimerStorage();

  return storage.set(state);
}

/**
 * Loads the current timer state from storage.
 *
 * This function utilizes a timer storage mechanism to retrieve the
 * saved state of a timer. If no state is found in the storage,
 * it returns `null`.
 */
export function loadTimer(): TimerState | null {
  const storage = createTimerStorage();

  return storage.get();
}

/**
 * Creates a new timer object with the specified properties.
 */
export function createTimer(payload: CreateTimerProps) {
  const { id, startedDate } = payload;

  const newTimer: TimerState = {
    ...INITIAL_TIMER,
    id,
    startDate: startedDate,
    originalStartDate: startedDate,
  };

  return newTimer;
}

/**
 * Removes the timer data from storage.
 *
 * This function creates an instance of the timer storage and invokes its `remove` method
 * to clear any stored timer-related data. It is typically used to reset or clean up
 * the timer state.
 */
export function removeTimer() {
  const storage = createTimerStorage();
  storage.remove();
}
