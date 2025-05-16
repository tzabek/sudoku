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
