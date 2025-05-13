import { Link } from 'react-router-dom';
import { Sidebar } from 'react-mui-sidebar';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import { green, pink } from '@mui/material/colors';
import {
  Pause,
  PlayArrow,
  Extension,
  AvTimer,
  ExpandMore,
  ExpandLess,
  StarBorder,
  Inbox,
} from '@mui/icons-material';
import { ActionButton, Progress } from '..';
import { useSidebar } from '../../lib/hooks';
import { formatTime } from '../../lib/libs/shared';

import './SidePanel.scss';

export default function SidePanel() {
  const {
    toggles: { toggleGameMenu },
    actions: { start, pause, resume, clear },
    data: { game, timer, progressProps, sidebar, isPaused },
  } = useSidebar();
  const { board, editable } = progressProps;

  return (
    <Sidebar mode="dark" isCollapse={!sidebar.isVisible} showProfile={false}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Box className="sidebar-brand">
              <Link to="/" className="brand-logo">
                <Extension sx={{ color: pink[500] }} className="logo" />
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ display: 'block' }}
                >
                  Sudoku
                </Typography>
              </Link>
            </Box>

            <Divider aria-hidden="true" component="div" />

            <Box className="sidebar-header">
              <Box className="game-info">
                <Box className="game-timer">
                  <AvTimer sx={{ color: isPaused ? pink[500] : green[500] }} />{' '}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ display: 'block' }}
                  >
                    {formatTime(timer.elapsedMs)}
                  </Typography>
                </Box>
              </Box>

              <Box className="game-actions">
                <ActionButton
                  aria-label={
                    isPaused ? 'Game is paused' : 'Game is in progress'
                  }
                  size="medium"
                  variant="contained"
                  disableElevation
                  startIcon={isPaused ? <PlayArrow /> : <Pause />}
                  onClick={() => {
                    if (isPaused) {
                      resume(game);
                      timer.resume();
                    } else {
                      pause(game);
                      timer.pause();
                    }
                  }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </ActionButton>
              </Box>
            </Box>

            <Divider aria-hidden="true" component="div" />

            <Box className="sidebar-header">
              {!!board.length && !!editable.length && (
                <Progress board={board} editable={editable} />
              )}
            </Box>
          </ListSubheader>
        }
      >
        <Divider aria-hidden="true" component="div" />
        <ListItemButton onClick={toggleGameMenu}>
          <ListItemIcon>
            <Inbox />
          </ListItemIcon>
          <ListItemText primary="Game menu" />
          {sidebar.menu.game.isActive ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={sidebar.menu.game.isActive} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                start();
                timer.start();
              }}
            >
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Start new game" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => clear(game)}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Clear board" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Sidebar>
  );
}
