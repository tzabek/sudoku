import { useEffect, useReducer } from 'react';
import {
  Board,
  createGame,
  GameActionProps,
  GameProps,
  generateClearBoardChanges,
  IGameContext,
  INITIAL_SUDOKU,
  loadGame,
  loadGames,
  saveGame,
  SudokuChangeBatch,
} from '../libs/game';
import { loadTimer, removeTimer } from '../libs/timer';
import { deepCopy } from '../libs/shared';

export function sudokuReducer(
  state: GameProps,
  action: GameActionProps
): GameProps {
  switch (action.type) {
    case 'create-game': {
      return createGame();
    }

    case 'start-game': {
      const now = Date.now();
      const currentGame: GameProps = JSON.parse(JSON.stringify(state));
      const timer = loadTimer();

      // Save current game before creating a new one
      if (currentGame.id && timer && timer.elapsedMs) {
        const updatedGame: GameProps = {
          ...currentGame,
          updatedDate: now,
          status: 'paused',
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

    case 'load-game': {
      const { payload } = action;

      return { ...state, ...payload };
    }

    case 'save-game': {
      const { game } = action.payload;

      return { ...state, ...game };
    }

    case 'update-cell': {
      const { game } = state;
      const { row, col, val } = action.payload;

      const copy: Board = game.map((r) => [...r]);
      copy[row][col] = val;

      return {
        ...state,
        game: copy,
        status: 'progress',
        timerActive: true,
        updatedDate: Date.now(),
      };
    }

    case 'clear-board': {
      const { game: board, editableCells: editable } = state;

      const { changes, clearBoard } = generateClearBoardChanges(
        board,
        editable
      );

      return {
        ...state,
        game: clearBoard,
        history: {
          undoStack: [...state.history.undoStack, { changes }],
          redoStack: [],
        },
      };
    }

    case 'apply-batch': {
      const { batch } = action.payload;

      const newBoard = deepCopy(state.game);

      batch.changes.forEach(({ row, col, newValue }) => {
        newBoard[row][col] = newValue;
      });

      return {
        ...state,
        game: newBoard,
        history: {
          undoStack: [...state.history.undoStack, batch],
          redoStack: [],
        },
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
      };
    }

    case 'pause-game': {
      const { game } = action.payload;

      const now = Date.now();

      return {
        ...state,
        ...game,
        updatedDate: now,
        status: 'paused',
        timerActive: false,
      };
    }

    case 'resume-game': {
      const { game } = action.payload;

      const now = Date.now();

      return {
        ...state,
        ...game,
        updatedDate: now,
        status: 'progress',
        timerActive: true,
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
        dispatch({ type: 'load-game', payload: game });
      } else {
        dispatch({ type: 'start-game' });
      }
    } else {
      dispatch({ type: 'create-game' });
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
    create: () => dispatch({ type: 'create-game' }),
    start: () => dispatch({ type: 'start-game' }),
    pause: () => dispatch({ type: 'pause-game', payload: { game: state } }),
    resume: () => dispatch({ type: 'resume-game', payload: { game: state } }),
    update: (row: number, col: number, val: number) =>
      dispatch({ type: 'update-cell', payload: { row, col, val } }),
    apply: (batch: SudokuChangeBatch) =>
      dispatch({ type: 'apply-batch', payload: { batch } }),
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    clear: () => dispatch({ type: 'clear-board' }),
  };

  return { contextValue };
}
