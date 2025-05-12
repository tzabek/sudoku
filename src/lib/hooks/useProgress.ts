import { useMemo } from 'react';
import { Board, Editable } from '../libs/game';

export default function useProgress(board: Board, editable: Editable) {
  return useMemo(() => {
    let filled = 0;
    let total = 0;

    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        if (editable[row][col]) {
          total += 1;

          if (board[row][col] !== 0) {
            filled += 1;
          }
        }
      }
    }

    return total === 0 ? 0 : (filled / total) * 100;
  }, [board, editable]);
}
