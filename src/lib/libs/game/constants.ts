/* eslint-disable import/no-cycle */
import {
  Difficulty,
  GameProps,
  IGameContext,
  SavedGames,
  HistoryState,
} from '.';

export const ALLOWED_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => String(i));

export const INITIAL_HISTORY_STATE: HistoryState = {
  undoStack: [],
  redoStack: [],
};

export const INITIAL_SUDOKU: GameProps = {
  id: '',
  game: [],
  history: INITIAL_HISTORY_STATE,
  solvedGame: [],
  editableCells: [],
  mistakes: [],
  timer: null,
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
  create: () => {},
  start: () => {},
  clear: () => {},
  apply: () => {},
  undo: () => {},
  redo: () => {},
  pause: () => {},
  resume: () => {},
  mistake: () => {},
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
