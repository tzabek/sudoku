/* eslint-disable import/no-cycle */
import { DIFFICULTY, GAME_STATUS } from '.';
import { TimerState } from '../timer';

export type Board = number[][];
export type Editable = boolean[][];
export type Candidates = (number[] | null)[][];
export type Cell = {
  value: number; // Final value (0 if empty)
  candidates: number[]; // Note candidates
  isInitial: boolean; // True if it's part of original puzzle
};
export type BoardCell = Cell[][];

export type Difficulty = (typeof DIFFICULTY)[number];

export type GameStatus = (typeof GAME_STATUS)[number];

export type GameProps = {
  id: string;
  game: Board;
  cells: BoardCell;
  history: HistoryState;
  solvedGame: Board;
  editableCells: Editable;
  mistakes: Mistake[];
  timer: TimerState | null;
  startedDate: number;
  updatedDate: number;
  completedDate: number;
  gameWon: boolean;
  status: GameStatus;
  timerActive: boolean;
  notesMode: boolean;
};

export interface ISudoku {
  start: (board: Board) => { editable: Editable };
  generate: () => { board: Board; cells: BoardCell; solution: Board };
  createEnhancedBoard: (numbers: Board) => BoardCell;
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
  applyBatch: (batch: ChangeBatch) => void;
  undo: () => void;
  redo: () => void;
  pause: (gameState: GameProps) => void;
  resume: (gameState: GameProps) => void;
  logMistake: (mistake: Mistake) => void;
  toggleNotesMode: () => void;
  toggleCandidate: (row: number, col: number, value: number) => void;
  clearCandidates: (row: number, col: number) => void;
  clearAllCandidates: () => void;
  removeCandidateFromPeers: (row: number, col: number, value: number) => void;
}

export type GameActionProps =
  | { type: 'create' }
  | { type: 'start' }
  | { type: 'apply-batch'; payload: { batch: ChangeBatch } }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'clear' }
  | { type: 'log-mistake'; payload: Mistake }
  | { type: 'load'; payload: GameProps }
  | { type: 'pause'; payload: { game: GameProps } }
  | { type: 'resume'; payload: { game: GameProps } }
  | { type: 'toggle-notes-mode' }
  | {
      type: 'toggle-candidate';
      payload: { row: number; col: number; value: number };
    }
  | { type: 'clear-candidates'; payload: { row: number; col: number } }
  | { type: 'clear-all-candidates' }
  | {
      type: 'remove-candidate-from-peers';
      payload: { row: number; col: number; value: number };
    };

export interface ICell {
  col: number;
  row: number;
  editable: Editable;
  board: Board;
  cell: Cell;
  value: number;
  status: GameStatus;
  onUpdate: (row: number, col: number, val: number) => void;
  onActivateHint: (
    e: React.FocusEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
  onActivateFocus: (row: number, col: number) => void;
  isNotesMode: boolean;
}

export interface ICellRef {
  activateHint: (row: number, col: number) => void;
  activateFocus: (row: number, col: number) => void;
}

export type HintProps = number[] | null;

export type CellChange = {
  row: number;
  col: number;
  previousValue: number;
  newValue: number;
};

export type CellFocus = {
  row: number;
  col: number;
};

export type ChangeBatch = {
  changes: CellChange[];
};

export type HistoryState = {
  undoStack: ChangeBatch[];
  redoStack: ChangeBatch[];
};

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

export type NumberTracker = Record<number, number>;
export type NumberTrackerProps = { board: Board };
