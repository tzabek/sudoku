/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
import {
  Board,
  createGameStorage,
  createSudoku,
  Editable,
  GameProps,
  INITIAL_HISTORY_STATE,
  CellChange,
  ChangeBatch,
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
    mistakes: [],
    timer: null,
    startedDate: now,
    updatedDate: now,
    completedDate: 0,
    gameWon: false,
    status: 'progress',
    timerActive: true,
  };

  return newState;
}

export function createChangeBatch(
  prevBoard: Board,
  newBoard: Board
): ChangeBatch {
  const changes: CellChange[] = [];

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
  const changes: CellChange[] = [];

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

export function isBoardFull(board: Board) {
  return board.every((row) => row.every((cell) => cell !== 0));
}

function isValidGroup(group: number[]) {
  const seen = new Set<number>();

  for (const val of group) {
    const num = Number(val);

    if (num === 0 || seen.has(num)) {
      return false;
    }

    seen.add(num);
  }

  return true;
}

export function isBoardSolved(board: Board) {
  const getBox = (boxIndex: number) => {
    const box: number[] = [];
    const startRow = Math.floor(boxIndex / 3) * 3;
    const startCol = (boxIndex % 3) * 3;

    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        box.push(board[startRow + r][startCol + c]);
      }
    }

    return box;
  };

  for (let i = 0; i < 9; i += 1) {
    const row = board[i];
    const col = board.map((r) => r[i]);
    const box = getBox(i);

    if (!isValidGroup(row) || !isValidGroup(col) || !isValidGroup(box)) {
      return false;
    }
  }

  return true;
}

export function calculateScore(elapsed: number, mistakes: number) {
  const baseScore = 1000;
  const seconds = Math.floor(elapsed / baseScore);
  const timePenalty = seconds * 2; // 2 points off per second
  const mistakePenalty = mistakes * 50; // 50 points off per mistake
  const score = baseScore - timePenalty - mistakePenalty;

  return Math.max(score, 0);
}
