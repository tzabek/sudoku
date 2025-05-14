import { use, useMemo } from 'react';

import GameContext from '../context/game-context';

export default function useMistakeStats() {
  const {
    game: { mistakes },
  } = use(GameContext);

  const total = mistakes.length;
  const byCell = useMemo(() => {
    const map = new Map<string, number>();

    // eslint-disable-next-line no-restricted-syntax
    for (const m of mistakes) {
      const key = `${m.row}-${m.col}`;

      map.set(key, (map.get(key) || 0) + 1);
    }

    return map;
  }, [mistakes]);

  return { total, byCell };
}
