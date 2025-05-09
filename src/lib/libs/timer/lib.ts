/* eslint-disable import/no-cycle */
import { createTimerStorage, TimerState } from '.';

export function saveTimer(state: Partial<TimerState>) {
  const storage = createTimerStorage();

  return storage.set(state);
}

export function loadTimer(): Partial<TimerState> | null {
  const storage = createTimerStorage();

  return storage.get();
}
