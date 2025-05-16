import { use } from 'react';
import { Slide, Snackbar } from '@mui/material';
import { getFormattedDate, getFormattedTime } from '../../lib/libs/shared';
import { useTimer } from '../../lib/hooks';

import GameContext from '../../lib/context/game-context';

import './Timer.scss';

function Timer() {
  const { game } = use(GameContext);

  const timer = useTimer({ game });

  return (
    <Snackbar
      open
      id="clock"
      slots={{ transition: Slide }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={
        <>
          <div className="date">{getFormattedDate()}</div>
          <div className="time">{getFormattedTime(timer.elapsedMs)}</div>
        </>
      }
      sx={{ top: { xs: 0 }, position: 'absolute' }}
    />
  );
}

Timer.displayName = 'Timer';

export default Timer;
