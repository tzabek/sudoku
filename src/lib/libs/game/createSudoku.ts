/* eslint-disable no-param-reassign */
import { Board, ISudoku } from '.';

/**
 * Creates a Sudoku game utility object with methods for generating, solving,
 * and manipulating Sudoku boards.
 *
 * Factory function to create a Sudoku game object with various utility methods.
 *
 * @method start
 * Initializes the editable state of the Sudoku board. Marks cells as editable if their value is `0`.
 *
 * @method generate
 * Generates a new Sudoku puzzle with a solution. Fills the board, removes numbers to create a puzzle, and returns both the puzzle and its solution.
 *
 * @method shuffle
 * Shuffles an array randomly using the Fisher-Yates algorithm.
 *
 * @method copy
 * Creates a deep copy of a Sudoku board.
 *
 * @method fill
 * Recursively fills a Sudoku board with valid numbers to create a complete solution.
 *
 * @method solve
 * Solves a Sudoku board using backtracking. Can also count the number of solutions and stop based on a condition.
 *
 * @method remove
 * Removes numbers from a filled Sudoku board to create a puzzle with a unique solution.
 *
 * @method clear
 * Clears the editable cells of a Sudoku board, resetting their values to `0`.
 *
 * @method isValid
 * Checks if placing a number in a specific cell is valid according to Sudoku rules.
 *
 * @method createEnhancedBoard
 * Upgraded board representation of richer structure allowing tracking candidates and distinguishing between
 * initial and user-entered values
 *
 * @method generateNumberArray
 * Generates an array of sequential numbers starting from 1.
 *
 * @method formatTime
 * Formats a time duration in seconds into a `MM:SS` string format.
 */
export default function createSudoku(): ISudoku {
  return {
    start(board) {
      return { editable: board.map((row) => row.map((cell) => cell === 0)) };
    },

    generate() {
      const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));

      this.fill(board);

      const solution = this.copy(board);

      this.remove(board, 40);

      // Required for user chosen cell candidates
      const cells = this.createEnhancedBoard(board);

      return { board, cells, solution };
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

    createEnhancedBoard(numbers) {
      return numbers.map((row) =>
        row.map((value) => ({ value, candidates: [], isInitial: value !== 0 }))
      );
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
