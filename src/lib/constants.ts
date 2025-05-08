// eslint-disable-next-line import/no-cycle
import {
  Difficulty,
  GameProps,
  IGameContext,
  ITimerReturn,
  SavedGames,
  SidebarState,
  TimerState,
} from './types';

export const STORAGE = {
  GAME: 'sudoku-progress',
  SIDEBAR: 'sidebar-state',
  TIMER: 'timer-state',
};

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
  startTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
};

export const INITIAL_SUDOKU: GameProps = {
  id: '',
  game: [],
  solvedGame: [],
  editableCells: [],
  startedDate: 0,
  updatedDate: 0,
  completedDate: 0,
  status: 'new',
  timerActive: false,
};

export const GAME_STATUS = ['new', 'progress', 'paused', 'completed'] as const;

export const INITIAL_SAVED_GAMES: SavedGames = {
  activeId: '',
  games: [],
};

export const INITIAL_GAME_CONTEXT: IGameContext = {
  game: INITIAL_SUDOKU,
  start: () => {},
  clear: () => {},
  update: () => {},
  pause: () => {},
  resume: () => {},
};

export const SIDEBAR_MENU = ['game', 'docs'] as const;

export const INITIAL_SIDEBAR_STATE: SidebarState = {
  isVisible: true,
  menu: {
    game: { isActive: true },
    docs: { isActive: false },
  },
};

export const DIFFICULTY = [
  'easiest',
  'easy',
  'medium',
  'standard',
  'hard',
  'hardest',
] as const;

export const DIFFICULTY_MAP: Record<Difficulty, number> = {
  easiest: 20,
  easy: 30,
  medium: 40,
  standard: 50,
  hard: 60,
  hardest: 70,
};

export const SETTINGS = {
  default: {
    grid: 9,
    halved: 3,
  },
} as const;
