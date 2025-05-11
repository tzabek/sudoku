/* eslint-disable import/no-cycle */
import {
  CreateTimerProps,
  createTimerStorage,
  INITIAL_TIMER,
  TimerState,
} from '.';

export function saveTimer(state: TimerState) {
  const storage = createTimerStorage();

  return storage.set(state);
}

export function loadTimer(): TimerState | null {
  const storage = createTimerStorage();

  return storage.get();
}

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

export function removeTimer() {
  const storage = createTimerStorage();
  storage.remove();
}
