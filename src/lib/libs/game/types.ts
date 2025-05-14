/* eslint-disable import/no-cycle */
import { ChangeEvent } from 'react';
import { DIFFICULTY, GAME_STATUS } from '.';
import { TimerState } from '../timer';

export type Board = number[][];
export type Editable = boolean[][];
export type Candidates = (number[] | null)[][];

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
  create: (gameState: GameProps) => void;
  start: () => void;
  clear: (gameState: GameProps) => void;
  update: (row: number, col: number, val: number) => void;
  apply: (batch: SudokuChangeBatch) => void;
  undo: () => void;
  redo: () => void;
  pause: (gameState: GameProps) => void;
  resume: (gameState: GameProps) => void;
}

export interface SudokuCellProps {
  col: number;
  row: number;
  editable: Editable;
  board: Board;
  value: number;
  onUpdate: (
    e: ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
  onActivateHint: (
    e: React.FocusEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
}

export interface SudokuCellRef {
  activateHint: (row: number, col: number) => void;
  getActiveHint: () => SudokuHintProps;
  isActiveHint: () => boolean;
}

export type SudokuHintProps = number[] | null;

export type SudokuCellChange = {
  row: number;
  col: number;
  previousValue: number;
  newValue: number;
};

export type SudokuChangeBatch = {
  changes: SudokuCellChange[];
};

export type SudokuHistoryState = {
  undoStack: SudokuChangeBatch[];
  redoStack: SudokuChangeBatch[];
};

export type GameProps = {
  id: string;
  game: Board;
  history: SudokuHistoryState;
  solvedGame: Board;
  editableCells: Editable;
  startedDate: number;
  updatedDate: number;
  completedDate: number;
  status: GameStatus;
  timerActive: boolean;
  timer: TimerState | null;
};

export type GameActionProps =
  | { type: 'create-game' }
  | { type: 'start-game' }
  | { type: 'update-cell'; payload: { row: number; col: number; val: number } }
  | { type: 'apply-batch'; payload: { batch: SudokuChangeBatch } }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'clear-board' }
  | { type: 'load-game'; payload: GameProps }
  | { type: 'save-game'; payload: { game: GameProps } }
  | { type: 'pause-game'; payload: { game: GameProps } }
  | { type: 'resume-game'; payload: { game: GameProps } };

export type SavedGames = {
  activeId: string;
  games: GameProps[];
};

export type SolutionModalProps = {
  game: Board;
  solvedGame: Board;
};

export type SelectedCellProps = {
  row: number;
  col: number;
};
