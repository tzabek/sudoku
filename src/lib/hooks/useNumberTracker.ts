import { useMemo } from 'react';
import { Board, NumberTracker } from '../libs/game';

export default function useNumberTracker(board: Board): NumberTracker {
  return useMemo(() => {
    const count: NumberTracker = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        const value = board[row][col];

        if (value >= 1 && value <= 9) {
          count[value] += 1;
        }
      }
    }

    return count;
  }, [board]);
}
