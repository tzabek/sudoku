import { useCallback, useEffect, useReducer } from 'react';
import { Board, GameActionProps, GameProps, IGameContext } from '../types';
import { createGameStorage, createSudoku } from '../lib';
import { INITIAL_SAVED_GAMES, INITIAL_SUDOKU } from '../constants';

export function sudokuReducer(state: GameProps, action: GameActionProps) {
  if (action.type === 'start-game') {
    // Update current game state
    const storage = createGameStorage();
    const now = new Date().getTime();
    const currentGame: GameProps = JSON.parse(JSON.stringify(state));

    if (currentGame.id) {
      const updatedGame: GameProps = {
        ...currentGame,
        updatedDate: now,
        status: 'paused',
        timerActive: false,
      };
      storage.set({ ...state, ...updatedGame });
    }

    // Create new game
    const sudoku = createSudoku();

    const { board: game, solution: solvedGame } = sudoku.generate();
    const { editable: editableCells } = sudoku.start(game);

    const id = crypto.randomUUID();
    const updatedState: GameProps = {
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

    // Save game
    return storage.set(updatedState);
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
    const storage = createGameStorage();

    const { game } = state;
    const { row, col, val } = action.payload;

    const copy: Board = game.map((r) => [...r]);
    copy[row][col] = val;

    const updatedState: GameProps = storage.set({
      ...state,
      game: copy,
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    });

    return updatedState;
  }

  if (action.type === 'clear-board') {
    const sudoku = createSudoku();
    const storage = createGameStorage();

    const {
      game: { game: board, editableCells: editable },
    } = action.payload;

    const copy: Board = sudoku.clear(board, editable).map((r) => [...r]);
    const updatedState: GameProps = storage.set({
      ...state,
      game: copy,
      status: 'progress',
      timerActive: true,
      updatedDate: new Date().getTime(),
    });

    return updatedState;
  }

  if (action.type === 'pause-game') {
    const { game } = action.payload;

    const storage = createGameStorage();
    const now = new Date().getTime();

    const updatedState: GameProps = storage.set({
      ...state,
      ...game,
      updatedDate: now,
      status: 'paused',
      timerActive: false,
    });

    return updatedState;
  }

  if (action.type === 'resume-game') {
    const { game } = action.payload;

    const storage = createGameStorage();
    const now = new Date().getTime();

    const updatedState: GameProps = storage.set({
      ...state,
      ...game,
      updatedDate: now,
      status: 'progress',
      timerActive: true,
    });

    return updatedState;
  }

  return state;
}

export function useSudoku() {
  const [state, dispatch] = useReducer(sudokuReducer, INITIAL_SUDOKU);

  const handleStartGame = useCallback(
    function handleStartGame() {
      dispatch({ type: 'start-game' });
    },
    [dispatch]
  );

  const handleLoadGame = useCallback(
    function handleLoadGame() {
      const storage = createGameStorage();
      const games = storage.getAll();

      if (games) {
        const { activeId } = games;

        const game = storage.get(activeId);
        const props = {
          type: game ? 'load-game' : 'start-game',
          ...(game ? { payload: game } : {}),
        } as GameActionProps;

        dispatch(props);
      } else {
        handleStartGame();
      }
    },
    [dispatch, handleStartGame]
  );

  const handleSaveGame = (gameState: GameProps) => {
    const storage = createGameStorage();
    const updatedGame = storage.set(gameState);

    if (updatedGame) {
      dispatch({
        type: 'save-game',
        payload: { game: updatedGame },
      });
    }
  };

  const handleUpdateCell = (row: number, col: number, val: number) => {
    dispatch({
      type: 'update-cell',
      payload: { row, col, val },
    });
  };

  const handleClearBoard = (gameState: GameProps) => {
    dispatch({
      type: 'clear-board',
      payload: { game: gameState },
    });
  };

  const handlePauseGame = (gameState: GameProps) => {
    dispatch({
      type: 'pause-game',
      payload: { game: gameState },
    });
  };

  const handleResumeGame = (gameState: GameProps) => {
    dispatch({
      type: 'resume-game',
      payload: { game: gameState },
    });
  };

  useEffect(() => {
    handleLoadGame();
  }, [handleLoadGame]);

  const contextValue: IGameContext = {
    game: state,
    storage: createGameStorage().getAll() || INITIAL_SAVED_GAMES,
    startGame: handleStartGame,
    pauseGame: handlePauseGame,
    resumeGame: handleResumeGame,
    saveGame: handleSaveGame,
    updateCell: handleUpdateCell,
    clearBoard: handleClearBoard,
  };

  return { contextValue };
}
