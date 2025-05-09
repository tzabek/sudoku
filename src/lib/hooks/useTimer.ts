import { useEffect, useReducer, useRef } from 'react';
import {
  INITIAL_TIMER,
  ITimerReturn,
  loadTimer,
  saveTimer,
  TimerActionProps,
  TimerState,
} from '../libs/timer';

function timerReducer(state: TimerState, action: TimerActionProps): TimerState {
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
    case 'load-timer':
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
}

export default function useTimer(): ITimerReturn {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = state.startDate !== null && state.pausedDate === null;

  // Load timer
  useEffect(() => {
    const saved = loadTimer();
    if (saved) {
      dispatch({ type: 'load-timer', state: saved });

      // If game was running, continue ticking
      const wasRunning = saved.startDate && !saved.pausedDate;
      if (wasRunning) {
        dispatch({ type: 'tick-timer', now: Date.now() });
      }
    }
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    saveTimer(state);
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

  return {
    elapsedMs: state.elapsedMs,
    isRunning,
    originalStartDate: state.originalStartDate,
    start,
    pause,
    resume,
  };
}
