import {
  DashboardCustomize,
  EditNote,
  GridView,
  Pause,
  PlayArrow,
  Redo,
  SystemUpdateAlt,
  Undo,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
} from '@mui/material';
import { use } from 'react';

import GameContext from '../../lib/context/game-context';

import './Toolbar.scss';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

function Toolbar() {
  return (
    <Paper
      className="toolbar-wrapper"
      elevation={0}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        background:
          'radial-gradient(ellipse at center, #0a2e38 35%, #000000 100%);',
      }}
    >
      <StyledToggleButtonGroup
        size="small"
        value="left"
        exclusive
        aria-label="Toolbar actions"
        className="toolbar-actions"
      >
        <Toolbar.Actions />
      </StyledToggleButtonGroup>

      <StyledToggleButtonGroup
        size="small"
        value="center"
        exclusive
        aria-label="Toolbar modes"
        className="toolbar-modes"
      >
        <Toolbar.Modes />
      </StyledToggleButtonGroup>

      <StyledToggleButtonGroup
        size="small"
        value="right"
        exclusive
        aria-label="Toolbar progress"
        className="toolbar-progress"
      >
        <Toolbar.Progress />
      </StyledToggleButtonGroup>
    </Paper>
  );
}

function ToolbarActions() {
  const { game, start, clear } = use(GameContext);

  return (
    <Box
      className="actions-toolbar toolbar-group"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        marginRight: 'auto',
      }}
    >
      <IconButton
        aria-label="Start new"
        size="small"
        sx={{ borderRadius: 0 }}
        onClick={() => start()}
      >
        <DashboardCustomize />
      </IconButton>
      <Divider orientation="vertical" variant="middle" flexItem />
      <IconButton aria-label="Load game" size="small" sx={{ borderRadius: 0 }}>
        <SystemUpdateAlt />
      </IconButton>
      <Divider orientation="vertical" variant="middle" flexItem />
      <IconButton
        aria-label="Clear board"
        size="small"
        sx={{ borderRadius: 0 }}
        onClick={() => clear(game)}
      >
        <GridView />
      </IconButton>
    </Box>
  );
}

ToolbarActions.displayName = 'ToolbarActions';

function ToolbarModes() {
  const { game, toggleNotesMode } = use(GameContext);
  const { notesMode } = game;

  return (
    <Box
      className="modes-toolbar toolbar-group"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.secondary',
      }}
    >
      <ToggleButtonGroup exclusive aria-label="Game modes">
        <ToggleButton
          value="notes"
          selected={notesMode}
          onChange={() => toggleNotesMode()}
        >
          <EditNote />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

ToolbarModes.displayName = 'ToolbarModes';

function ToolbarProgress() {
  const { game, undo, redo, resume, pause } = use(GameContext);
  const { history, status, notesMode } = game;
  const { undoStack, redoStack } = history;

  return (
    <Box
      className="progress-toolbar toolbar-group"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        marginLeft: 'auto',
      }}
    >
      <IconButton
        aria-label={game.status === 'paused' ? 'Resume' : 'Pause'}
        size="small"
        sx={{ borderRadius: 0 }}
        onClick={() => (game.status === 'paused' ? resume(game) : pause(game))}
      >
        {game.status === 'paused' ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Divider orientation="vertical" variant="middle" flexItem />
      <IconButton
        aria-label="Undo"
        size="small"
        disabled={!undoStack.length || status === 'completed' || notesMode}
        sx={{ borderRadius: 0 }}
        onClick={() => undo()}
      >
        <Undo />
      </IconButton>
      <Divider orientation="vertical" variant="middle" flexItem />
      <IconButton
        aria-label="Redo"
        size="small"
        disabled={!redoStack.length || status === 'completed' || notesMode}
        sx={{ borderRadius: 0 }}
        onClick={() => redo()}
      >
        <Redo />
      </IconButton>
    </Box>
  );
}

ToolbarProgress.displayName = 'ToolbarProgress';

Toolbar.displayName = 'Toolbar';
Toolbar.Actions = ToolbarActions;
Toolbar.Modes = ToolbarModes;
Toolbar.Progress = ToolbarProgress;

export default Toolbar;
