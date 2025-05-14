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
  apply: (batch: ChangeBatch) => void;
  undo: () => void;
  redo: () => void;
  pause: (gameState: GameProps) => void;
  resume: (gameState: GameProps) => void;
  mistake: (mistake: Mistake) => void;
}

export interface ICell {
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

export interface ICellRef {
  activateHint: (row: number, col: number) => void;
  getActiveHint: () => HintProps;
  isActiveHint: () => boolean;
}

export type HintProps = number[] | null;

export type CellChange = {
  row: number;
  col: number;
  previousValue: number;
  newValue: number;
};

export type ChangeBatch = {
  changes: CellChange[];
};

export type HistoryState = {
  undoStack: ChangeBatch[];
  redoStack: ChangeBatch[];
};

export type GameProps = {
  id: string;
  game: Board;
  history: HistoryState;
  solvedGame: Board;
  editableCells: Editable;
  mistakes: Mistake[];
  timer: TimerState | null;
  startedDate: number;
  updatedDate: number;
  completedDate: number;
  status: GameStatus;
  timerActive: boolean;
};

export type GameActionProps =
  | { type: 'create' }
  | { type: 'start' }
  | { type: 'apply'; payload: { batch: ChangeBatch } }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'clear' }
  | { type: 'mistake'; payload: Mistake }
  | { type: 'load'; payload: GameProps }
  | { type: 'pause'; payload: { game: GameProps } }
  | { type: 'resume'; payload: { game: GameProps } };

export type SavedGames = {
  activeId: string;
  games: GameProps[];
};

export type SelectedCellProps = {
  row: number;
  col: number;
};

export type Mistake = {
  row: number;
  col: number;
  enteredValue: number;
  correctValue: number;
  timestamp: number;
};
