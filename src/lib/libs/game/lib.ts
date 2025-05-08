import { createGameStorage, createSudoku, GameProps } from '.';

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
