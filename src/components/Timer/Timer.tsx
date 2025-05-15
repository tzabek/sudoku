import { use } from 'react';
import { Slide, Snackbar } from '@mui/material';
import { formatTime } from '../../lib/libs/shared';
import { useTimer } from '../../lib/hooks';

import GameContext from '../../lib/context/game-context';

function Timer() {
  const { game } = use(GameContext);

  const timer = useTimer({ game });

  return (
    <Snackbar
      open
      slots={{ transition: Slide }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={formatTime(timer.elapsedMs)}
      sx={{ top: { xs: 0 }, position: 'absolute' }}
    />
  );
}

Timer.displayName = 'Timer';

export default Timer;
