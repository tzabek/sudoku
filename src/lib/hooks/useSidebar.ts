import { use, useState } from 'react';
import { useTimer } from '.';

import GameContext from '../context/game-context';

export default function useSidebar() {
  const { game, start, clear, pause, resume } = use(GameContext);
  const { game: board, editableCells: editable } = game;

  const [showGameMenu, setShowGameMenu] = useState<boolean>(false);

  const timer = useTimer({ game });
  const progressProps = { board, editable };
  const isPaused = game.status === 'paused';

  return {
    actions: { start, clear, pause, resume },
    data: { game, timer, progressProps, isPaused },
    menu: { showGameMenu, setShowGameMenu },
  };
}
