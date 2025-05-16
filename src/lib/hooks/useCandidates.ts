import { useMemo } from 'react';
import { Board, Candidates, Editable } from '../libs/game';

/**
 * A custom hook that calculates the possible candidates for each cell in a Sudoku board.
 * It determines which numbers (1-9) can be placed in each empty and editable cell
 * based on the current state of the board and Sudoku rules.
 *
 * @remarks
 * - The hook uses `useMemo` to optimize performance by recalculating candidates
 *   only when the `board` or `editable` matrices change.
 * - The candidates for each cell are determined by checking the numbers already
 *   used in the same row, column, and 3x3 box.
 */
export default function useCandidates(
  board: Board,
  editable: Editable
): Candidates {
  return useMemo(() => {
    const candidates: Candidates = [];

    for (let row = 0; row < 9; row += 1) {
      const candidateRow: (number[] | null)[] = [];

      for (let col = 0; col < 9; col += 1) {
        if (board[row][col] === 0 && editable[row][col]) {
          const used = new Set<number>();

          // Row and column
          for (let i = 0; i < 9; i += 1) {
            used.add(board[row][i]);
            used.add(board[i][col]);
          }

          // Box
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;
          for (let r = 0; r < 3; r += 1) {
            for (let c = 0; c < 3; c += 1) {
              used.add(board[boxRow + r][boxCol + c]);
            }
          }

          const possible: number[] = [];
          for (let n = 1; n <= 9; n += 1) {
            if (!used.has(n)) {
              possible.push(n);
            }
          }

          candidateRow.push(possible);
        } else {
          candidateRow.push(null);
        }
      }

      candidates.push(candidateRow);
    }

    return candidates;
  }, [board, editable]);
}
