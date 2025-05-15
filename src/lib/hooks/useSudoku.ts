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
