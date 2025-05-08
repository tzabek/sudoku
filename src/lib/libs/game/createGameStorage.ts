import { GameProps, IGameStorage, SavedGames } from '.';
import { STORAGE } from '../shared';

export default function createGameStorage(): IGameStorage {
  return {
    getAll() {
      try {
        const savedData = localStorage.getItem(STORAGE.GAME);

        return savedData ? JSON.parse(savedData) : null;
      } catch {
        return null;
      }
    },

    get(id) {
      try {
        const savedData = this.getAll();

        return savedData
          ? savedData.games?.find((game) => game.id === id) || null
          : null;
      } catch {
        return null;
      }
    },

    set(gameState) {
      const { id } = gameState;

      if (this.getAll()) {
        return this.get(id) ? this.update(gameState) : this.add(gameState);
      }

      return this.create(gameState);
    },

    add(gameState) {
      const { id } = gameState;

      const savedData = this.getAll() as SavedGames;

      const updatedGame: GameProps = {
        ...gameState,
        updatedDate: new Date().getTime(),
      };

      const { games } = savedData;

      const updatedGames = [updatedGame, ...games];

      const updatedData = JSON.stringify({
        ...savedData,
        activeId: id,
        games: updatedGames,
      });

      localStorage.setItem(STORAGE.GAME, updatedData);

      return updatedGame;
    },

    create(gameState) {
      const { id } = gameState;

      const updatedData = JSON.stringify({
        activeId: id,
        games: [gameState],
      });

      localStorage.setItem(STORAGE.GAME, updatedData);

      return gameState;
    },

    update(gameState) {
      const { id } = gameState;

      const savedData = this.getAll() as SavedGames;
      const game = this.get(gameState.id) as GameProps;

      const updatedGame: GameProps = {
        ...game,
        ...gameState,
        updatedDate: new Date().getTime(),
      };

      const { games } = savedData;

      const updatedGames = [updatedGame, ...games.filter((g) => g.id !== id)];

      const updatedData = JSON.stringify({
        ...savedData,
        activeId: id,
        games: updatedGames,
      });

      localStorage.setItem(STORAGE.GAME, updatedData);

      return updatedGame;
    },
  };
}
