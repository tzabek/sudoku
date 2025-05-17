/* eslint-disable import/no-cycle */
import {
  Difficulty,
  GameProps,
  IGameContext,
  SavedGames,
  HistoryState,
  Cell,
} from '.';

const NON_NUMERIC_INPUT = [
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Tab',
];

export const NUMERIC_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const ALLOWED_INPUT = [
  ...NUMERIC_INPUT.map((i) => String(i)),
  ...NON_NUMERIC_INPUT,
];

export const INITIAL_HISTORY_STATE: HistoryState = {
  undoStack: [],
  redoStack: [],
};

export const INITIAL_CELL: Cell = {
  value: 0,
  candidates: [],
  isInitial: false,
};

export const INITIAL_SUDOKU: GameProps = {
  id: '',
  game: [],
  cells: [],
  history: INITIAL_HISTORY_STATE,
  solvedGame: [],
  editableCells: [],
  mistakes: [],
  timer: null,
  startedDate: 0,
  updatedDate: 0,
  completedDate: 0,
  gameWon: false,
  status: 'new',
  timerActive: false,
  notesMode: false,
};

export const GAME_STATUS = [
  'new',
  'progress',
  'paused',
  'incorrect',
  'completed',
] as const;

export const INITIAL_SAVED_GAMES: SavedGames = {
  activeId: '',
  games: [],
};

export const INITIAL_GAME_CONTEXT: IGameContext = {
  game: INITIAL_SUDOKU,
  create: () => {},
  start: () => {},
  clear: () => {},
  applyBatch: () => {},
  undo: () => {},
  redo: () => {},
  pause: () => {},
  resume: () => {},
  logMistake: () => {},
  toggleNotesMode: () => {},
  toggleCandidate: () => {},
  clearCandidates: () => {},
  clearAllCandidates: () => {},
  removeCandidateFromPeers: () => {},
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
