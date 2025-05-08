import { useEffect, useReducer, useRef } from 'react';
import { STORAGE } from '../libs/shared';

interface TimerState {
  startDate: number | null;
  pausedDate: number | null;
  originalStartDate: number | null;
  elapsedBeforePause: number;
  elapsedMs: number;
}

type TimerAction =
  | { type: 'start-timer'; now: number }
  | { type: 'pause-timer'; now: number }
  | { type: 'resume-timer'; now: number }
  | { type: 'tick-timer'; now: number }
  | { type: 'reset-timer' }
  | { type: 'load-timer'; state: Partial<TimerState> };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start-timer':
      return {
        startDate: action.now,
        pausedDate: null,
        originalStartDate: action.now,
        elapsedBeforePause: 0,
        elapsedMs: 0,
      };
    case 'pause-timer': {
      if (!state.startDate) return state;
      const elapsed = state.elapsedBeforePause + (action.now - state.startDate);
      return {
        ...state,
        startDate: null,
        pausedDate: action.now,
        elapsedBeforePause: elapsed,
        elapsedMs: elapsed,
      };
    }
    case 'resume-timer':
      if (!state.pausedDate) return state;
      return {
        ...state,
        startDate: action.now,
        pausedDate: null,
      };
    case 'tick-timer':
      if (!state.startDate || state.pausedDate) return state;
      return {
        ...state,
        elapsedMs: state.elapsedBeforePause + (action.now - state.startDate),
      };
    case 'reset-timer':
      return {
        startDate: null,
        pausedDate: null,
        originalStartDate: null,
        elapsedBeforePause: 0,
        elapsedMs: 0,
      };
    case 'load-timer':
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
}

const initialTimerState: TimerState = {
  startDate: null,
  pausedDate: null,
  originalStartDate: null,
  elapsedBeforePause: 0,
  elapsedMs: 0,
};

function saveTimerState(state: Partial<TimerState>) {
  localStorage.setItem(STORAGE.TIMER, JSON.stringify(state));
}

function loadTimerState(): Partial<TimerState> | null {
  try {
    const raw = localStorage.getItem(STORAGE.TIMER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface UseGameTimerReturn {
  elapsedMs: number;
  isRunning: boolean;
  originalStartDate: number | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export default function useTimer(): UseGameTimerReturn {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = state.startDate !== null && state.pausedDate === null;

  // Load from localStorage on first mount
  useEffect(() => {
    const saved = loadTimerState();
    if (saved) {
      dispatch({ type: 'load-timer', state: saved });

      // If game was running, continue ticking
      const wasRunning = saved.startDate && !saved.pausedDate;
      if (wasRunning) {
        dispatch({ type: 'tick-timer', now: Date.now() });
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveTimerState(state);
  }, [state]);

  // Timer ticking
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'tick-timer', now: Date.now() });
      }, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => dispatch({ type: 'start-timer', now: Date.now() });
  const pause = () => dispatch({ type: 'pause-timer', now: Date.now() });
  const resume = () => dispatch({ type: 'resume-timer', now: Date.now() });
  const reset = () => {
    localStorage.removeItem(STORAGE.TIMER);
    dispatch({ type: 'reset-timer' });
  };

  return {
    elapsedMs: state.elapsedMs,
    isRunning,
    originalStartDate: state.originalStartDate,
    start,
    pause,
    resume,
    reset,
  };
}
