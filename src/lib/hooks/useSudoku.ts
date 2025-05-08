import { useEffect, useReducer } from 'react';
import { Board, GameActionProps, GameProps, IGameContext } from '../types';
import { createGameStorage, createSudoku } from '../lib';
import { INITIAL_SUDOKU } from '../constants';

function loadGames() {
  const storage = createGameStorage();

  return storage.getAll();
}

function saveGame(updated: GameProps) {
  const storage = createGameStorage();

  return storage.set(updated);
}

function loadGame(gameId: string) {
  const saved = loadGames();

  if (saved) {
    const { games } = saved;

    return games.find(({ id }) => id === gameId) || null;
  }

  return null;
}

function createGame() {
  const sudoku = createSudoku();

  const { board: game, solution: solvedGame } = sudoku.generate();
  const { editable: editableCells } = sudoku.start(game);

  const now = new Date().getTime();
  const id = crypto.randomUUID();
  const newState: GameProps = {
    id,
    game,
    solvedGame,
    editableCells,
    startedDate: now,
    updatedDate: now,
    completedDate: 0,
    status: 'progress',
    timerActive: true,
  };

  return newState;
}

export function sudokuReducer(state: GameProps, action: GameActionProps) {
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

    const updatedState: GameProps = { ...state, ...payload };

    return updatedState;
  }

  if (action.type === 'save-game') {
    const { game } = action.payload;

    const updatedState: GameProps = { ...state, ...game };

    return updatedState;
  }

  if (action.type === 'update-cell') {
    const { game } = state;
    const { row, col, val } = action.payload;

    const copy: Board = game.map((r) => [...r]);
    copy[row][col] = val;

    const updatedState: GameProps = {
      ...state,
      game: copy,
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    };

    return updatedState;
  }

  if (action.type === 'clear-board') {
    const sudoku = createSudoku();

    const {
      game: { game: board, editableCells: editable },
    } = action.payload;

    const copy: Board = sudoku.clear(board, editable).map((r) => [...r]);
    const updatedState: GameProps = {
      ...state,
      game: copy,
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    };

    return updatedState;
  }

  if (action.type === 'pause-game') {
    const { game } = action.payload;

    const now = new Date().getTime();

    const updatedState: GameProps = {
      ...state,
      ...game,
      updatedDate: now,
      status: 'paused',
      timerActive: false,
    };

    return updatedState;
  }

  if (action.type === 'resume-game') {
    const { game } = action.payload;

    const now = new Date().getTime();

    const updatedState: GameProps = {
      ...state,
      ...game,
      updatedDate: now,
      status: 'progress',
      timerActive: true,
    };

    return updatedState;
  }

  return state;
}

export function useSudoku() {
  const [state, dispatch] = useReducer(sudokuReducer, INITIAL_SUDOKU);

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

  // Save state to localStorage whenever it changes
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
