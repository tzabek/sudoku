import { useEffect, useReducer } from 'react';
import {
  createGame,
  GameActionProps,
  GameProps,
  generateClearBoardChanges,
  IGameContext,
  INITIAL_SUDOKU,
  loadGame,
  loadGames,
  saveGame,
  ChangeBatch,
  Mistake,
  isBoardFull,
  isBoardSolved,
  GameStatus,
} from '../libs/game';
import { loadTimer, removeTimer, TimerState } from '../libs/timer';
import { deepCopy } from '../libs/shared';

/**
 * Reducer function for managing the state of a Sudoku game.
 *
 * ### Action Types:
 * @emits @method create
 * Creates a new Sudoku game.
 *
 * @emits @method start
 * Starts a new game, saving the current game state and resetting the timer.
 *
 * @emits @method load
 * Loads a game state from the provided payload.
 *
 * @emits @method clear
 * Clears the board by removing values from non-editable cells.
 *
 * @emits @method apply-batch
 * Applies a batch of changes to the board and updates the game status.
 *
 * @emits @method undo
 * Reverts the last batch of changes made to the board.
 *
 * @emits @method redo
 * Reapplies the last undone batch of changes to the board.
 *
 * @emits @method pause
 * Pauses the game and updates the state with the provided game data.
 *
 * @emits @method resume
 * Resumes the game and updates the state with the provided game data.
 *
 * @emits @method log-mistake
 * Records a mistake made by the player.
 *
 * @emits @method toggle-notes-mode
 * Toggles between:
 *    - `'normal mode'`: user inputs a number to a cell
 *    - `'notes mode'`: adds/removes small "candidate" numbers as pencil marks
 *
 * @emits @method toggle-candidate
 * Records a candidate for a cell provided by user
 *
 * @emits @method clear-candidates
 * Clears all cell-specific candidates provided by user
 *
 * @emits @method clear-all-candidates
 * Clears all cells from candidates
 *
 * @emits @method remove-candidate-from-peers
 * When a value is placed in a cell in 'normal mode'
 *    - automatically removes that value from the 'candidates' arrays of all other cells in:
 *      - the same row
 *      - the same column
 *      - the same 3x3 block
 *
 * ### State Properties:
 * - `game`: The current state of the Sudoku board.
 * - `history`: Tracks undo and redo stacks for board changes.
 * - `status`: The current status of the game (`'progress'`, `'paused'`, `'completed'`, etc.).
 * - `timerActive`: Indicates whether the game timer is active.
 * - `timer`: Tracks the timer state, including elapsed time and pause information.
 * - `gameWon`: A boolean indicating whether the game has been won.
 * - `mistakes`: An array of mistakes made by the player.
 * - `updatedDate`: A timestamp of the last state update.
 * - `completedDate`: A timestamp of when the game was completed.
 *
 * ### Notes:
 * - The reducer ensures immutability by creating deep copies of the state when necessary.
 * - The `apply` action checks if the board is full and solved to determine the game status.
 * - Undo and redo actions manage the history stacks to allow reverting or reapplying changes.
 * - Timer-related actions (`start`, `pause`, `resume`) update the timer state accordingly.
 */
export function sudokuReducer(
  state: GameProps,
  action: GameActionProps
): GameProps {
  switch (action.type) {
    case 'create': {
      return createGame();
    }

    case 'start': {
      const now = Date.now();
      const currentGame: GameProps = JSON.parse(JSON.stringify(state));
      const status: GameStatus = currentGame.gameWon ? 'completed' : 'paused';
      const timer = loadTimer();

      // Save current game before creating a new one
      if (currentGame.id && timer && timer.elapsedMs) {
        // Clear candidates from all cells
        const { clearCells } = generateClearBoardChanges(
          deepCopy(currentGame.game),
          currentGame.editableCells
        );

        // Save current Timer state
        const savedTimer = {
          ...timer,
          pausedDate: now,
          startDate: null,
          elapsedBeforePause: timer.elapsedMs,
          elapsedMs: timer.elapsedMs,
        };

        const updatedGame: GameProps = {
          ...currentGame,
          cells: clearCells,
          updatedDate: now,
          status,
          timerActive: false,
          timer: savedTimer,
        };

        saveGame({ ...state, ...updatedGame });
      }

      const newGame = createGame();

      removeTimer();

      return newGame;
    }

    case 'load': {
      const { payload } = action;

      return { ...state, ...payload };
    }

    case 'clear': {
      const { game: board, editableCells: editable } = state;

      const { changes, clearBoard, clearCells } = generateClearBoardChanges(
        board,
        editable
      );

      // Return current state if no changes were applied
      if (JSON.stringify(clearBoard) === JSON.stringify(board)) {
        return state;
      }

      return {
        ...state,
        game: clearBoard,
        cells: clearCells,
        history: {
          undoStack: [...state.history.undoStack, { changes }],
          redoStack: [],
        },
        updatedDate: Date.now(),
      };
    }

    case 'apply-batch': {
      const { batch } = action.payload;
      const { changes } = batch;
      const { status, game, cells } = state;

      const now = Date.now();
      const newBoard = deepCopy(game);
      const newCells = deepCopy(cells);

      changes.forEach(({ row, col, newValue }) => {
        newBoard[row][col] = newValue;

        const cell = newCells[row][col];

        newCells[row][col] = {
          ...cell,
          value: newValue,
          candidates: [],
        };
      });

      const isFull = isBoardFull(newBoard);
      const isSolved = isFull && isBoardSolved(newBoard);

      let gameStatus = status;
      let timerActive = true;
      let currentTimer: TimerState | null = loadTimer();

      if (isFull && !isSolved) {
        gameStatus = 'incorrect';
      } else if (isSolved) {
        gameStatus = 'completed';
        timerActive = false;

        if (currentTimer) {
          currentTimer = {
            ...currentTimer,
            pausedDate: currentTimer.pausedDate || now,
            startDate: null,
            elapsedBeforePause: currentTimer.elapsedMs,
            elapsedMs: currentTimer.elapsedMs,
          };
        }
      } else {
        gameStatus = 'progress';
      }

      return {
        ...state,
        game: newBoard,
        cells: newCells,
        history: {
          undoStack: [...state.history.undoStack, batch],
          redoStack: [],
        },
        updatedDate: now,
        gameWon: isSolved,
        completedDate: isSolved ? now : 0,
        status: gameStatus,
        timerActive,
        timer: currentTimer,
      };
    }

    case 'undo': {
      const undoStack = [...state.history.undoStack];
      const redoStack = [...state.history.redoStack];
      const lastBatch = undoStack.pop();

      if (!lastBatch) {
        return state;
      }

      const newBoard = deepCopy(state.game);
      const newCells = deepCopy(state.cells);

      lastBatch.changes.forEach(({ row, col, previousValue }) => {
        newBoard[row][col] = previousValue;

        const cell = newCells[row][col];

        newCells[row][col] = {
          ...cell,
          value: previousValue,
          candidates: [],
        };
      });

      return {
        ...state,
        game: newBoard,
        cells: newCells,
        history: {
          undoStack,
          redoStack: [lastBatch, ...redoStack],
        },
        updatedDate: Date.now(),
        timerActive: true,
        status: 'progress',
      };
    }

    case 'redo': {
      const undoStack = [...state.history.undoStack];
      const redoStack = [...state.history.redoStack];
      const nextBatch = redoStack.shift();

      if (!nextBatch) {
        return state;
      }

      const newBoard = deepCopy(state.game);
      const newCells = deepCopy(state.cells);

      nextBatch.changes.forEach(({ row, col, newValue }) => {
        newBoard[row][col] = newValue;

        const cell = newCells[row][col];

        newCells[row][col] = {
          ...cell,
          value: newValue,
          candidates: [],
        };
      });

      return {
        ...state,
        game: newBoard,
        cells: newCells,
        history: {
          undoStack: [...undoStack, nextBatch],
          redoStack,
        },
        updatedDate: Date.now(),
        timerActive: true,
        status: 'progress',
      };
    }

    case 'pause': {
      const { game } = action.payload;

      return {
        ...state,
        ...game,
        updatedDate: Date.now(),
        status: 'paused',
        timerActive: false,
      };
    }

    case 'resume': {
      const { game } = action.payload;

      return {
        ...state,
        ...game,
        updatedDate: Date.now(),
        status: 'progress',
        timerActive: true,
      };
    }

    case 'log-mistake': {
      return {
        ...state,
        mistakes: [...state.mistakes, action.payload],
      };
    }

    case 'toggle-notes-mode': {
      return {
        ...state,
        notesMode: !state.notesMode,
      };
    }

    case 'toggle-candidate': {
      const { row, col, value } = action.payload;
      const { cells } = state;

      const newCells = deepCopy(cells);
      const cell = newCells[row][col];

      if (cell.value !== 0 || cell.isInitial) {
        return state;
      }

      const exists = cell.candidates.includes(value);
      const newCandidates = exists
        ? cell.candidates.filter((n) => n !== value)
        : [...cell.candidates, value].sort();

      newCells[row][col] = {
        ...cell,
        candidates: newCandidates,
      };

      return { ...state, cells: newCells };
    }

    case 'clear-candidates': {
      const { row, col } = action.payload;

      const newCells = deepCopy(state.cells);

      newCells[row][col].candidates = [];

      return {
        ...state,
        cells: newCells,
      };
    }

    case 'clear-all-candidates': {
      const { cells } = state;

      const updatedCells = deepCopy(cells).map((row) =>
        row.map((cell) => ({ ...cell, candidates: [] }))
      );

      return {
        ...state,
        cells: updatedCells,
      };
    }

    case 'remove-candidate-from-peers': {
      const { row, col, value } = action.payload;
      const { cells } = state;

      const updatedCells = cells.map((r, rowIdx) =>
        r.map((cell, colIdx) => {
          const sameRow = rowIdx === row;
          const sameCol = colIdx === col;
          const sameBlock =
            Math.floor(rowIdx / 3) === Math.floor(row / 3) &&
            Math.floor(colIdx / 3) === Math.floor(col / 3);
          const isSameCell = rowIdx === row && colIdx === col;

          if (!isSameCell && (sameRow || sameCol || sameBlock)) {
            return {
              ...cell,
              candidates: (
                cell.candidates?.filter((n) => n !== value) || []
              ).sort(),
            };
          }

          return cell;
        })
      );

      return {
        ...state,
        cells: updatedCells,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * A custom hook for managing the state and actions of a Sudoku game.
 *
 * This hook provides a context value containing the current game state and
 * various actions to manipulate the game, such as creating a new game,
 * starting, pausing, resuming, applying changes, undoing, redoing, clearing,
 * and recording mistakes. It also handles loading and saving the game state
 * to persistent storage.
 *
 * @remarks
 * - The game state is managed using a `useReducer` hook with a `sudokuReducer`.
 * - The game is automatically loaded from storage on initialization, and
 *   changes to the game state are saved to storage.
 */
export function useSudoku() {
  const [state, dispatch] = useReducer(sudokuReducer, INITIAL_SUDOKU);

  // Load game
  useEffect(() => {
    const saved = loadGames();

    if (saved) {
      const { activeId: gameId } = saved;

      const game = loadGame(gameId);

      if (game) {
        dispatch({ type: 'load', payload: game });
      } else {
        dispatch({ type: 'start' });
      }
    } else {
      dispatch({ type: 'create' });
    }
  }, []);

  // Save game to storage whenever it changes
  useEffect(() => {
    if (state.id) {
      saveGame(state);
    }
  }, [state]);

  const contextValue: IGameContext = {
    game: state,
    create: () => dispatch({ type: 'create' }),
    start: () => dispatch({ type: 'start' }),
    pause: () => dispatch({ type: 'pause', payload: { game: state } }),
    resume: () => dispatch({ type: 'resume', payload: { game: state } }),
    applyBatch: (batch: ChangeBatch) =>
      dispatch({ type: 'apply-batch', payload: { batch } }),
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    clear: () => dispatch({ type: 'clear' }),
    logMistake: (mistake: Mistake) =>
      dispatch({ type: 'log-mistake', payload: mistake }),
    toggleNotesMode: () => dispatch({ type: 'toggle-notes-mode' }),
    toggleCandidate: (row: number, col: number, value: number) =>
      dispatch({
        type: 'toggle-candidate',
        payload: { row, col, value },
      }),
    clearCandidates: (row: number, col: number) =>
      dispatch({ type: 'clear-candidates', payload: { row, col } }),
    clearAllCandidates: () => dispatch({ type: 'clear-all-candidates' }),
    removeCandidateFromPeers: (row: number, col: number, value: number) =>
      dispatch({
        type: 'remove-candidate-from-peers',
        payload: { row, col, value },
      }),
  };

  return { contextValue };
}
