import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  createTimerStorage,
  INITIAL_TIMER,
  TimerAction,
  TimerState,
} from '../libs/timer';

export function timerReducer(
  state: TimerState,
  action: TimerAction
): TimerState {
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

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = state.startDate !== null && state.pausedDate === null;

  const handleTickTimer = useCallback(
    function handleTickTimer() {
      dispatch({ type: 'tick-timer', now: Date.now() });
    },
    [dispatch]
  );

  const handleLoadTimer = useCallback(
    function handleLoadTimer() {
      const storage = createTimerStorage();
      const saved = storage.get();

      if (saved) {
        dispatch({ type: 'load-timer', state: saved });

        const wasRunning = !!(saved.startDate && !saved.pausedDate);
        if (wasRunning) {
          handleTickTimer();
        }
      }
    },
    [dispatch, handleTickTimer]
  );

  const handleStartTimer = useCallback(
    function handleStartTimer() {
      dispatch({ type: 'start-timer', now: Date.now() });
    },
    [dispatch]
  );

  const handlePauseTimer = useCallback(
    function handlePauseTimer() {
      dispatch({ type: 'pause-timer', now: Date.now() });
    },
    [dispatch]
  );

  const handleResumeTimer = useCallback(
    function handleResumeTimer() {
      dispatch({ type: 'resume-timer', now: Date.now() });
    },
    [dispatch]
  );

  useEffect(() => {
    handleLoadTimer();
  }, [handleLoadTimer]);

  useEffect(() => {
    const storage = createTimerStorage();
    storage.set(state);
  }, [state]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        handleTickTimer();
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
  }, [handleTickTimer, isRunning]);

  return {
    elapsedMs: state.elapsedMs,
    isRunning,
    originalStartDate: state.originalStartDate,
    startTimer: handleStartTimer,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
  };
}
