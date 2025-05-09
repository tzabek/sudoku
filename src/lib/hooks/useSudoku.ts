import { useEffect, useReducer } from 'react';
import {
  Board,
  createGame,
  createSudoku,
  GameActionProps,
  GameProps,
  IGameContext,
  INITIAL_SUDOKU,
  loadGame,
  loadGames,
  saveGame,
} from '../libs/game';

export function sudokuReducer(
  state: GameProps,
  action: GameActionProps
): GameProps {
  if (action.type === 'create-game') {
    return createGame();
  }

  if (action.type === 'start-game') {
    const now = new Date().getTime();
    const currentGame: GameProps = JSON.parse(JSON.stringify(state));

    if (currentGame.id) {
      const updatedGame: GameProps = {
        ...currentGame,
        updatedDate: now,
        status: 'paused',
        timerActive: false,
      };
      saveGame({ ...state, ...updatedGame });
    }

    return createGame();
  }

  if (action.type === 'load-game') {
    const { payload } = action;

    return { ...state, ...payload };
  }

  if (action.type === 'save-game') {
    const { game } = action.payload;

    return { ...state, ...game };
  }

  if (action.type === 'update-cell') {
    const { game } = state;
    const { row, col, val } = action.payload;

    const copy: Board = game.map((r) => [...r]);
    copy[row][col] = val;

    return {
      ...state,
      game: copy,
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    };
  }

  if (action.type === 'clear-board') {
    const sudoku = createSudoku();

    const {
      game: { game: board, editableCells: editable },
    } = action.payload;

    return {
      ...state,
      game: sudoku.clear(board, editable).map((r) => [...r]),
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    };
  }

  if (action.type === 'pause-game') {
    const { game } = action.payload;

    const now = new Date().getTime();

    return {
      ...state,
      ...game,
      updatedDate: now,
      status: 'paused',
      timerActive: false,
    };
  }

  if (action.type === 'resume-game') {
    const { game } = action.payload;

    const now = new Date().getTime();

    return {
      ...state,
      ...game,
      updatedDate: now,
      status: 'progress',
      timerActive: true,
    };
  }

  return state;
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
    clear: () => dispatch({ type: 'clear-board', payload: { game: state } }),
  };

  return { contextValue };
}
