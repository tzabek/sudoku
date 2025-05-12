/* eslint-disable import/no-cycle */
import { GameProps } from '../game';

export type TimerState = {
  id: string;
  startDate: number | null;
  pausedDate: number | null;
  originalStartDate: number;
  elapsedBeforePause: number;
  elapsedMs: number;
};

export type UseTimerProps = {
  game: GameProps;
};

export interface ITimerStorage {
  get: () => TimerState | null;
  set: (timer: TimerState) => TimerState;
  remove: () => void;
}

export type CreateTimerProps = {
  id: GameProps['id'];
  startedDate: GameProps['startedDate'];
};

export type TimerActionProps =
  | {
      type: 'create-timer';
      payload: CreateTimerProps;
    }
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
