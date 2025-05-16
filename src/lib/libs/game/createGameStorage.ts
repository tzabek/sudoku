import { GameProps, IGameStorage, SavedGames } from '.';
import { STORAGE } from '../shared';

/**
 * Creates a game storage utility for managing game states in localStorage.
 *
 * This utility provides methods to retrieve, add, update, and manage game states
 * stored in the browser's localStorage under a specific key. It ensures that
 * game states are serialized and deserialized properly and handles scenarios
 * where localStorage might not be accessible or contain invalid data.
 *
 * @method getAll
 * Retrieves all saved game data from localStorage.
 *
 * @method get
 * Retrieves a specific game state by its ID.
 *
 * @method set
 * Saves a game state to localStorage. If the game already exists, it updates it;
 * otherwise, it adds a new game or creates a new storage entry.
 *
 * @method add
 * Adds a new game state to the existing saved games in localStorage.
 *
 * @method create
 * Creates a new storage entry in localStorage with the given game state.
 *
 * @method update
 * Updates an existing game state in localStorage.
 */
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
        updatedDate: Date.now(),
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
        updatedDate: Date.now(),
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
