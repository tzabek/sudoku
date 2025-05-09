/* eslint-disable import/no-cycle */
import { ITimerReturn, TimerState } from '.';

export const INITIAL_TIMER: TimerState = {
  startDate: null,
  pausedDate: null,
  originalStartDate: null,
  elapsedBeforePause: 0,
  elapsedMs: 0,
};

export const INITIAL_TIMER_RETURN: ITimerReturn = {
  elapsedMs: 0,
  isRunning: false,
  originalStartDate: 0,
  start: () => {},
  pause: () => {},
  resume: () => {},
};
