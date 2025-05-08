/* eslint-disable no-param-reassign */
import { STORAGE } from './constants';
import {
  Board,
  ISudoku,
  IGameStorage,
  GameProps,
  SavedGames,
  ISidebarStorage,
  ITimerStorage,
} from './types';

export function createSudoku(): ISudoku {
  return {
    start(board) {
      return { editable: board.map((row) => row.map((cell) => cell === 0)) };
    },

    generate() {
      const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));

      this.fill(board);

      const solution = this.copy(board);

      this.remove(board, 40);

      return { board, solution };
    },

    shuffle(array) {
      const arr = [...array];

      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
    },

    copy(board) {
      return board.map((row) => [...row]);
    },

    fill(board) {
      for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
          if (board[row][col] === 0) {
            const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            // eslint-disable-next-line no-restricted-syntax
            for (const num of nums) {
              if (this.isValid(board, row, col, num)) {
                board[row][col] = num;

                if (this.fill(board)) {
                  return true;
                }

                board[row][col] = 0;
              }
            }

            return false;
          }
        }
      }

      return true;
    },

    solve(board, count = { value: 0 }, shouldStop = () => false) {
      for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num += 1) {
              if (this.isValid(board, row, col, num)) {
                board[row][col] = num;

                if (this.solve(board, count, shouldStop)) {
                  return true;
                }

                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }

      count.value += 1;

      return !shouldStop();
    },

    remove(board, attempts = 40) {
      while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col] !== 0) {
          const backup = board[row][col];
          board[row][col] = 0;

          const boardCopy = this.copy(board);
          const count = { value: 0 };
          this.solve(boardCopy, count, () => count.value > 1);

          if (count.value !== 1) {
            board[row][col] = backup;
          }

          attempts -= 1;
        }
      }
    },

    clear(board, editable) {
      for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
          if (editable[row][col]) {
            board[row][col] = 0;
          }
        }
      }

      return board;
    },

    isValid(board, row, col, num) {
      for (let i = 0; i < 9; i += 1) {
        if (board[row][i] === num || board[i][col] === num) {
          return false;
        }
      }

      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;

      for (let r = 0; r < 3; r += 1) {
        for (let c = 0; c < 3; c += 1) {
          if (board[boxRow + r][boxCol + c] === num) {
            return false;
          }
        }
      }

      return true;
    },

    generateNumberArray(len) {
      return Array.from({ length: len }, (_, i) => i + 1);
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');

      return `${mins}:${secs}`;
    },
  };
}

export function createGameStorage(): IGameStorage {
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

      // eslint-disable-next-line no-nested-ternary
      return this.getAll()
        ? this.get(id)
          ? this.update(gameState)
          : this.add(gameState)
        : this.create(gameState);
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

export function createSidebarStorage(): ISidebarStorage {
  return {
    get() {
      try {
        const savedData = localStorage.getItem(STORAGE.SIDEBAR);

        return savedData ? JSON.parse(savedData) : null;
      } catch {
        return null;
      }
    },

    set(sidebar) {
      localStorage.setItem(STORAGE.SIDEBAR, JSON.stringify(sidebar));

      return sidebar;
    },
  };
}

export function createTimerStorage(): ITimerStorage {
  return {
    get() {
      try {
        const savedData = localStorage.getItem(STORAGE.TIMER);

        return savedData ? JSON.parse(savedData) : null;
      } catch {
        return null;
      }
    },

    set(timer) {
      localStorage.setItem(STORAGE.TIMER, JSON.stringify(timer));

      return timer;
    },
  };
}
