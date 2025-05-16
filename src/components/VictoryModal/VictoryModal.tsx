/* eslint-disable react/jsx-props-no-spreading */
import { use, useRef } from 'react';

import Draggable from 'react-draggable';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
  Typography,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { getFormattedTime } from '../../lib/libs/shared';
import { calculateScore } from '../../lib/libs/game';

import GameContext from '../../lib/context/game-context';

/**
 * A custom Paper component that enables draggable functionality for dialogs.
 *
 * This component wraps the Material-UI `Paper` component with the `react-draggable` library
 * to allow the dialog to be moved around the screen by dragging a specific handle.
 *
 * ## Notes
 * - The `nodeRef` is used to ensure compatibility with React's strict mode.
 * - Ensure that the `handle` selector matches an element within the dialog for proper dragging functionality.
 */
function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

/**
 * VictoryModal is a React functional component that displays a modal dialog
 * when the user successfully solves a puzzle. It provides information about
 * the game completion, including the time taken, the number of mistakes made,
 * and the calculated score. The modal also includes an option to start a new game.
 *
 * @component
 *
 * @remarks
 * - This component uses the `GameContext` to access game state, including whether the game is won,
 *   the elapsed time, and the number of mistakes.
 * - The modal is draggable, with a custom `PaperComponent` for styling.
 * - The `getFormattedTime` and `calculateScore` utility functions are used to format the elapsed time
 *   and compute the score, respectively.
 */
function VictoryModal() {
  const {
    game: { gameWon, timer, mistakes },
    start,
  } = use(GameContext);

  const elapsedMs = timer?.elapsedMs || 0;

  return (
    <Dialog
      open={gameWon}
      maxWidth="xs"
      fullWidth
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog">
        <EmojiEvents /> Congratulations!
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You solved the puzzle!
        </Typography>

        <Box mt={2}>
          <Typography>
            <strong>Time:</strong> {getFormattedTime(elapsedMs)}
          </Typography>
          <Typography>
            <strong>Mistakes:</strong> {mistakes.length}
          </Typography>
          <Typography>
            <strong>Score:</strong> {calculateScore(elapsedMs, mistakes.length)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => start()} variant="contained">
          Play again
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VictoryModal.displayName = 'VictoryModal';

export default VictoryModal;
