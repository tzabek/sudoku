export type TimerState = {
  id: string;
  startDate: number | null;
  pausedDate: number | null;
  originalStartDate: number | null;
  elapsedBeforePause: number;
  elapsedMs: number;
};

export type UseTimerProps = {
  id: string;
};

export interface ITimerStorage {
  get: () => TimerState | null;
  set: (timer: TimerState) => TimerState;
}

export type TimerActionProps =
  | { type: 'create-timer'; id: string }
  | { type: 'start-timer'; now: number }
  | { type: 'pause-timer'; now: number }
  | { type: 'resume-timer'; now: number }
  | { type: 'tick-timer'; now: number }
  | { type: 'load-timer'; state: TimerState };

export interface ITimerReturn {
  elapsedMs: number;
  isRunning: boolean;
  originalStartDate: number | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
}
