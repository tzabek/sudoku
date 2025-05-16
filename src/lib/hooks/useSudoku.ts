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
 * - `'create'`: Creates a new Sudoku game.
 * - `'start'`: Starts a new game, saving the current game state and resetting the timer.
 * - `'load'`: Loads a game state from the provided payload.
 * - `'clear'`: Clears the board by removing values from non-editable cells.
 * - `'apply'`: Applies a batch of changes to the board and updates the game status.
 * - `'undo'`: Reverts the last batch of changes made to the board.
 * - `'redo'`: Reapplies the last undone batch of changes to the board.
 * - `'pause'`: Pauses the game and updates the state with the provided game data.
 * - `'resume'`: Resumes the game and updates the state with the provided game data.
 * - `'mistake'`: Records a mistake made by the player.
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
        const updatedGame: GameProps = {
          ...currentGame,
          updatedDate: now,
          status,
          timerActive: false,
          timer: {
            ...timer,
            pausedDate: now,
            startDate: null,
            elapsedBeforePause: timer.elapsedMs,
            elapsedMs: timer.elapsedMs,
          },
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

      const { changes, clearBoard } = generateClearBoardChanges(
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
        history: {
          undoStack: [...state.history.undoStack, { changes }],
          redoStack: [],
        },
        updatedDate: Date.now(),
      };
    }

    case 'apply': {
      const { batch } = action.payload;
      const { changes } = batch;
      const { status, game } = state;

      const now = Date.now();
      const newBoard = deepCopy(game);

      changes.forEach(({ row, col, newValue }) => {
        newBoard[row][col] = newValue;
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

      lastBatch.changes.forEach(({ row, col, previousValue }) => {
        newBoard[row][col] = previousValue;
      });

      return {
        ...state,
        game: newBoard,
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

      nextBatch.changes.forEach(({ row, col, newValue }) => {
        newBoard[row][col] = newValue;
      });

      return {
        ...state,
        game: newBoard,
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

    case 'mistake': {
      return {
        ...state,
        mistakes: [...state.mistakes, action.payload],
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
    apply: (batch: ChangeBatch) =>
      dispatch({ type: 'apply', payload: { batch } }),
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    clear: () => dispatch({ type: 'clear' }),
    mistake: (mistake: Mistake) =>
      dispatch({ type: 'mistake', payload: mistake }),
  };

  return { contextValue };
}
