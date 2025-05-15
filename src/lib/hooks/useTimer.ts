import { useEffect, useReducer, useRef } from 'react';
import {
  createTimer,
  INITIAL_TIMER,
  ITimerReturn,
  loadTimer,
  saveTimer,
  TimerActionProps,
  TimerState,
  UseTimerProps,
} from '../libs/timer';

function timerReducer(state: TimerState, action: TimerActionProps): TimerState {
  switch (action.type) {
    case 'create-timer':
      return createTimer(action.payload);
    case 'start-timer':
      return {
        ...state,
        startDate: action.now,
        pausedDate: null,
        originalStartDate: action.now,
        elapsedBeforePause: 0,
        elapsedMs: 0,
      };
    case 'pause-timer': {
      if (!state.startDate) {
        return state;
      }

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
      if (!state.pausedDate) {
        return state;
      }

      return {
        ...state,
        startDate: action.now,
        pausedDate: null,
      };
    case 'tick-timer': {
      if (!state.startDate || state.pausedDate) {
        return state;
      }

      const elapsed = state.elapsedBeforePause + (action.now - state.startDate);

      return {
        ...state,
        elapsedMs: elapsed,
      };
    }
    case 'load-timer':
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
}

export default function useTimer(props: UseTimerProps): ITimerReturn {
  const {
    game: { id, startedDate, timerActive, status },
  } = props;

  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = state.startDate !== null && state.pausedDate === null;

  // Load timer
  useEffect(() => {
    const saved = loadTimer();

    if (saved) {
      dispatch({ type: 'load-timer', state: saved });
      // If game was running, continue ticking
      const wasRunning = !!(saved.startDate && !saved.pausedDate);

      if (wasRunning) {
        dispatch({ type: 'tick-timer', now: Date.now() });
      }
    } else {
      dispatch({ type: 'create-timer', payload: { id, startedDate } });
    }
  }, [id, startedDate]);

  // Save state to storage whenever it changes
  useEffect(() => {
    if (state.id) {
      saveTimer(state);
    }

    // Stop timer if the game is complete
    if (status === 'paused' || status === 'completed') {
      dispatch({ type: 'pause-timer', now: Date.now() });
    } else {
      dispatch({ type: 'resume-timer', now: Date.now() });
    }
  }, [status, state]);

  // Resume timer when sudoku board changes
  useEffect(() => {
    if (timerActive) {
      dispatch({ type: 'resume-timer', now: Date.now() });
    }
  }, [timerActive]);

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

  return {
    elapsedMs: state.elapsedMs,
    isRunning,
    originalStartDate: state.originalStartDate,
    start: () => dispatch({ type: 'start-timer', now: Date.now() }),
    pause: () => dispatch({ type: 'pause-timer', now: Date.now() }),
    resume: () => dispatch({ type: 'resume-timer', now: Date.now() }),
  };
}
