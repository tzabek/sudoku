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

/**
 * Loads all saved games from the game storage.
 *
 * This function initializes the game storage and retrieves all stored games.
 * It is useful for fetching previously saved game data for further processing
 * or display in the application.
 */
export function loadGames() {
  const storage = createGameStorage();

  return storage.getAll();
}

/**
 * Saves the current state of the game to persistent storage.
 *
 * This function utilizes a storage mechanism to persist the updated game state.
 * It creates a new instance of the game storage and sets the provided game data.
 */
export function saveGame(updated: GameProps) {
  const storage = createGameStorage();

  return storage.set(updated);
}

/**
 * Loads a specific game by its unique identifier.
 *
 * This function retrieves a saved collection of games and searches for a game
 * that matches the provided `gameId`. If a matching game is found, it is returned;
 * otherwise, `null` is returned. If no saved games exist, the function also returns `null`.
 */
export function loadGame(gameId: string) {
  const saved = loadGames();

  if (saved) {
    const { games } = saved;

    return games.find(({ id }) => id === gameId) || null;
  }

  return null;
}

/**
 * Creates a new Sudoku game state.
 *
 * This function initializes a new Sudoku game by generating a puzzle and its solution,
 * determining which cells are editable, and setting up the initial game state.
 */
export function createGame() {
  const sudoku = createSudoku();

  const { board: game, cells, solution: solvedGame } = sudoku.generate();
  const { editable: editableCells } = sudoku.start(game);

  const now = Date.now();
  const id = crypto.randomUUID();
  const newState: GameProps = {
    id,
    game,
    cells,
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
    notesMode: false,
  };

  return newState;
}

/**
 * Creates a batch of changes by comparing two Sudoku boards.
 *
 * This function iterates through all cells of the provided `prevBoard` and `newBoard`,
 * and identifies the differences between them. For each cell where the value has changed,
 * it records the row, column, previous value, and new value in the resulting change batch.
 */
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

/**
 * Generates the changes required to clear specific cells of a Sudoku board
 * based on the provided editable mask, and returns the updated board along
 * with the list of changes.
 *
 * @remarks
 * This function uses a Sudoku utility to clear cells in the board based on the
 * editable mask. It ensures that only cells marked as editable are cleared, and
 * tracks the changes made for further processing or undo functionality.
 */
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

  const clearCells = sudoku.createBoardFromNumbers(clearBoard);

  return { changes, clearBoard, clearCells };
}

/**
 * Checks if a Sudoku board is completely filled.
 *
 * This function iterates through all rows and cells of the given board
 * to determine if there are any empty cells (represented by the value `0`).
 */
export function isBoardFull(board: Board) {
  return board.every((row) => row.every((cell) => cell !== 0));
}

/**
 * Checks if a group of numbers is valid according to Sudoku rules.
 *
 * A valid group must meet the following criteria:
 * - It contains no duplicate numbers.
 * - It does not include the number `0`.
 */
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

/**
 * Checks if a Sudoku board is completely solved.
 *
 * A board is considered solved if all rows, columns, and 3x3 sub-boxes
 * contain the numbers 1 through 9 exactly once.
 *
 * @remarks
 * - The function uses a helper function `getBox` to extract the numbers
 *   in a 3x3 sub-box based on its index (0 to 8).
 * - It also assumes the existence of a helper function `isValidGroup`
 *   that checks if an array contains the numbers 1 through 9 exactly once.
 * - The board is validated by iterating through all rows, columns, and
 *   sub-boxes, ensuring each group is valid.
 */
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

/**
 * Calculates the score for a game based on the elapsed time and the number of mistakes made.
 */
export function calculateScore(elapsed: number, mistakes: number) {
  const baseScore = 1000;
  const seconds = Math.floor(elapsed / baseScore);
  const timePenalty = seconds * 2; // 2 points off per second
  const mistakePenalty = mistakes * 50; // 50 points off per mistake
  const score = baseScore - timePenalty - mistakePenalty;

  return Math.max(score, 0);
}
