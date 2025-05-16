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

/**
 * Reducer function to manage the state of a timer. Handles various actions
 * such as creating, starting, pausing, resuming, ticking, and loading a timer.
 *
 * Action Types:
 * - `'create-timer'`: Initializes a new timer state using the provided payload.
 * - `'start-timer'`: Starts the timer, setting the start date and resetting elapsed time.
 * - `'pause-timer'`: Pauses the timer, calculating and storing the elapsed time.
 * - `'resume-timer'`: Resumes the timer from a paused state.
 * - `'tick-timer'`: Updates the elapsed time while the timer is running.
 * - `'load-timer'`: Loads a previously saved timer state.
 *
 * Notes:
 * - The `'pause-timer'` action has no effect if the timer is not currently running.
 * - The `'resume-timer'` action has no effect if the timer is not paused.
 * - The `'tick-timer'` action updates the elapsed time only if the timer is running
 *   and not paused.
 */
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

/**
 * Custom React hook for managing a timer with start, pause, and resume functionality.
 * The timer state is persisted and restored automatically, and it updates in real-time.
 *
 * @remarks
 * - The timer state is saved to persistent storage whenever it changes.
 * - The timer automatically resumes or pauses based on the `timerActive` property.
 * - The hook uses `setInterval` to update the timer in real-time while it is running.
 */
export default function useTimer(props: UseTimerProps): ITimerReturn {
  const {
    game: { id, startedDate, timerActive },
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
  }, [state]);

  // Resume timer when sudoku board changes
  useEffect(() => {
    if (timerActive) {
      dispatch({ type: 'resume-timer', now: Date.now() });
    } else {
      dispatch({ type: 'pause-timer', now: Date.now() });
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
