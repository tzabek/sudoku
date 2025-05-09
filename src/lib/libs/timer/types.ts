export type TimerState = {
  startDate: number | null;
  pausedDate: number | null;
  originalStartDate: number | null;
  elapsedBeforePause: number;
  elapsedMs: number;
};

export interface ITimerStorage {
  get: () => Partial<TimerState> | null;
  set: (timer: Partial<TimerState>) => Partial<TimerState>;
}

export type TimerActionProps =
  | { type: 'start-timer'; now: number }
  | { type: 'pause-timer'; now: number }
  | { type: 'resume-timer'; now: number }
  | { type: 'tick-timer'; now: number }
  | { type: 'load-timer'; state: Partial<TimerState> };

export interface ITimerReturn {
  elapsedMs: number;
  isRunning: boolean;
  originalStartDate: number | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
}
