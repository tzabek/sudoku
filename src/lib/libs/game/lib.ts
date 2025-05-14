/* eslint-disable import/no-cycle */
import {
  Board,
  createGameStorage,
  createSudoku,
  Editable,
  GameProps,
  INITIAL_HISTORY_STATE,
  SudokuCellChange,
  SudokuChangeBatch,
} from '.';
import { deepCopy } from '../shared';

export function loadGames() {
  const storage = createGameStorage();

  return storage.getAll();
}

export function saveGame(updated: GameProps) {
  const storage = createGameStorage();

  return storage.set(updated);
}

export function loadGame(gameId: string) {
  const saved = loadGames();

  if (saved) {
    const { games } = saved;

    return games.find(({ id }) => id === gameId) || null;
  }

  return null;
}

export function createGame() {
  const sudoku = createSudoku();

  const { board: game, solution: solvedGame } = sudoku.generate();
  const { editable: editableCells } = sudoku.start(game);

  const now = Date.now();
  const id = crypto.randomUUID();
  const newState: GameProps = {
    id,
    game,
    history: INITIAL_HISTORY_STATE,
    solvedGame,
    editableCells,
    startedDate: now,
    updatedDate: now,
    completedDate: 0,
    status: 'progress',
    timerActive: true,
    timer: null,
  };

  return newState;
}

export function createChangeBatch(
  prevBoard: Board,
  newBoard: Board
): SudokuChangeBatch {
  const changes: SudokuCellChange[] = [];

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const previousValue = prevBoard[row][col];
      const newValue = newBoard[row][col];

      if (previousValue !== newValue) {
        changes.push({ row, col, previousValue, newValue });
      }
    }
  }

  return { changes };
}

export function generateClearBoardChanges(board: Board, editable: Editable) {
  const sudoku = createSudoku();
  const clearBoard = sudoku.clear(deepCopy(board), editable).map((r) => [...r]);
  const changes: SudokuCellChange[] = [];

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (clearBoard[row][col] === 0 && board[row][col] !== 0) {
        changes.push({
          row,
          col,
          previousValue: board[row][col],
          newValue: 0,
        });
      }
    }
  }

  return { changes, clearBoard };
}
