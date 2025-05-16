import { use } from 'react';
import { Slide, Snackbar } from '@mui/material';
import { getFormattedDate, getFormattedTime } from '../../lib/libs/shared';
import { useTimer } from '../../lib/hooks';

import GameContext from '../../lib/context/game-context';

import './Timer.scss';

/**
 * Timer component displays a live timer and date in a Snackbar UI element for Sudoku game.
 *
 * This component uses the `GameContext` to access the current game state and
 * a custom `useTimer` hook to track the elapsed time. The timer is displayed
 * alongside the current date in a Snackbar positioned at the top-center of the screen.
 *
 * @component
 *
 * @remarks
 * - The `useTimer` hook is expected to provide the elapsed time in milliseconds.
 * - The `getFormattedDate` and `getFormattedTime` utility functions are used to format
 *   the date and time for display.
 * - The Snackbar uses a `Slide` transition and is styled to be positioned absolutely
 *   at the top of the viewport.
 *
 * @dependencies
 * - `GameContext`: Provides the current game state.
 * - `useTimer`: Custom hook to track elapsed time.
 * - `getFormattedDate`: Utility function to format the current date.
 * - `getFormattedTime`: Utility function to format the elapsed time.
 */
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
