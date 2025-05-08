import { ReactNode } from 'react';
// eslint-disable-next-line import/no-cycle
import { DIFFICULTY, GAME_STATUS, SIDEBAR_MENU } from './constants';

export type GridProps = {
  children: ReactNode;
};

export type ColumnProps = {
  columnId: string;
  children: ReactNode;
};

export type CellProps = {
  cellId: string;
  row: number;
  col: number;
  children: ReactNode;
};

export type SolutionModalProps = {
  game: Board;
  solvedGame: Board;
};

export interface InputProps {
  value: number;
  editable: boolean;
  row: number;
  col: number;
  onChange: (row: number, col: number, value: number) => void;
}

// ====== GAME ======

export type Board = number[][];
export type Editable = boolean[][];

export type Difficulty = (typeof DIFFICULTY)[number];

export type GameStatus = (typeof GAME_STATUS)[number];

export interface ISudoku {
  start: (board: Board) => { editable: Editable };
  generate: () => { board: Board; solution: Board };
  shuffle: (arr: number[]) => number[];
  copy: (board: Board) => Board;
  fill: (board: Board) => boolean;
  solve: (
    board: Board,
    count: { value: number },
    shouldStop: () => boolean
  ) => boolean;
  remove: (board: Board, attempts: number) => void;
  clear: (board: Board, editable: Editable) => Board;
  isValid: (board: Board, row: number, col: number, num: number) => boolean;
  generateNumberArray: (len: number) => number[];
  formatTime: (seconds: number) => string;
}

export interface IGameStorage {
  getAll: () => SavedGames | null;
  get: (id: string) => GameProps | null;
  set: (gameState: GameProps) => GameProps;
  add: (gameState: GameProps) => GameProps;
  create: (gameState: GameProps) => GameProps;
  update: (gameState: GameProps) => GameProps;
}

export interface IGameContext {
  game: GameProps;
  start: () => void;
  clear: (gameState: GameProps) => void;
  update: (row: number, col: number, val: number) => void;
  pause: (gameState: GameProps) => void;
  resume: (gameState: GameProps) => void;
}

export type GameProps = {
  id: string;
  game: Board;
  solvedGame: Board;
  editableCells: Editable;
  startedDate: number;
  updatedDate: number;
  completedDate: number;
  status: GameStatus;
  timerActive: boolean;
};

export type GameActionProps =
  | { type: 'start-game' }
  | { type: 'update-cell'; payload: { row: number; col: number; val: number } }
  | { type: 'load-game'; payload: GameProps }
  | { type: 'save-game'; payload: { game: GameProps } }
  | { type: 'clear-board'; payload: { game: GameProps } }
  | { type: 'pause-game'; payload: { game: GameProps } }
  | { type: 'resume-game'; payload: { game: GameProps } };

export type SavedGames = {
  activeId: string;
  games: GameProps[];
};

// ====== SIDEBAR ======

export type SidebarMenu = (typeof SIDEBAR_MENU)[number];

export type SidebarState = {
  isVisible: boolean;
  menu: { [K in SidebarMenu]: { isActive: boolean } };
};

export interface ISidebarStorage {
  get: () => SidebarState | null;
  set: (sidebar: SidebarState) => SidebarState;
}

// ====== TIMER ======

export type TimerState = {
  startDate: number | null;
  pausedDate: number | null;
  originalStartDate: number | null;
  elapsedBeforePause: number;
  elapsedMs: number;
};

export interface ITimerStorage {
  get: () => Partial<TimerState> | null;
  set: (timer: Partial<TimerState>) => Partial<TimerState>;
}

export type TimerAction =
  | { type: 'start-timer'; now: number }
  | { type: 'pause-timer'; now: number }
  | { type: 'resume-timer'; now: number }
  | { type: 'tick-timer'; now: number }
  | { type: 'load-timer'; state: Partial<TimerState> };

export interface ITimerReturn {
  elapsedMs: number;
  isRunning: boolean;
  originalStartDate: number | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}
