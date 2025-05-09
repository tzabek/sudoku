/* eslint-disable import/no-cycle */
import { createTimerStorage, INITIAL_TIMER, TimerState } from '.';

export function saveTimer(state: TimerState) {
  const storage = createTimerStorage();

  return storage.set(state);
}

export function loadTimer(): TimerState | null {
  const storage = createTimerStorage();

  return storage.get();
}

export function createTimer(id: string) {
  const now = Date.now();
  const newTimer: TimerState = {
    ...INITIAL_TIMER,
    id,
    startDate: now,
    originalStartDate: now,
  };

  return newTimer;
}
