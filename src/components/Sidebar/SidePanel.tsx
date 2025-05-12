import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import { Sidebar } from 'react-mui-sidebar';
import {
  Box,
  Collapse,
  Divider,
  IconButton,
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
  Dehaze,
  Extension,
  Close,
  AvTimer,
  SportsEsports,
  ExpandMore,
  ExpandLess,
  SportsScore,
  BorderAll,
  Lightbulb,
  ChevronRight,
  StarBorder,
  Inbox,
} from '@mui/icons-material';
import { ActionButton } from '..';
import { useSidebar } from '../../lib/hooks';
import { formatTime } from '../../lib/libs/shared';

import './SidePanel.scss';
import Progress from './Progress';

export default function SidePanel() {
  const {
    toggles: { toggleSidebar, toggleGameMenu },
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
                <Typography>Sudoku</Typography>
              </Link>
            </Box>

            <Divider aria-hidden="true" component="div" />

            <Box className="sidebar-header">
              <Box className="game-info">
                <Box component="span" className="game-status">
                  <SportsEsports
                    sx={{ color: isPaused ? pink[500] : green[500] }}
                  />{' '}
                  <Box component="span">{capitalize(game.status)}</Box>
                </Box>
                <Box className="game-timer">
                  <AvTimer />{' '}
                  <Box component="span">{formatTime(timer.elapsedMs)}</Box>
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
                  <Box component="span">{isPaused ? 'Resume' : 'Pause'}</Box>
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
          <ListItemText primary="Inbox" />
          {sidebar.menu.game.isActive ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={sidebar.menu.game.isActive} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Sidebar>
  );

  return (
    <Box
      className={[
        'page-wrapper',
        'chiller-theme',
        ...(sidebar.isVisible ? ['toggled'] : []),
      ].join(' ')}
    >
      <IconButton
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        id="show-sidebar"
      >
        <Dehaze />
      </IconButton>

      <Box component="nav" id="sidebar" className="sidebar-wrapper">
        <Box className="sidebar-content">
          <Box className="sidebar-brand">
            <Link to="/" className="brand-logo">
              <Extension sx={{ color: pink[500] }} className="logo" />
              <Box component="span">Sudoku</Box>
            </Link>
            <Link to="/" className="close-sidebar">
              <Close onClick={toggleSidebar} />
            </Link>
          </Box>

          <Divider />

          <div className="sidebar-header">
            <div className="game-info">
              <span className="game-status">
                <SportsEsports
                  sx={{ color: isPaused ? pink[500] : green[500] }}
                />{' '}
                <span>{capitalize(game.status)}</span>
              </span>
              <span className="game-timer">
                <AvTimer /> <span>{formatTime(timer.elapsedMs)}</span>
              </span>
            </div>

            <div className="game-actions">
              <ActionButton
                aria-label={isPaused ? 'Game is paused' : 'Game is in progress'}
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
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </ActionButton>
            </div>
          </div>

          <div className="sidebar-subheader">
            <div className="game-hint">
              <div id="game-hint" />
            </div>
            <div id="game-progress-bar" />
          </div>

          <Divider />

          <div className="sidebar-menu">
            <ul>
              <li
                className={[
                  'sidebar-dropdown',
                  ...(sidebar.menu.game.isActive ? ['active'] : []),
                ].join(' ')}
              >
                <Link to="/" onClick={toggleGameMenu}>
                  <span className="svg-wrapper">
                    <Extension />
                  </span>
                  <span className="text">Game</span>
                  {sidebar.menu.game.isActive ? <ExpandLess /> : <ExpandMore />}
                </Link>
                <div
                  className="sidebar-submenu"
                  style={{
                    display: sidebar.menu.game.isActive ? 'block' : 'none',
                  }}
                >
                  <ul>
                    <li>
                      <Link
                        to="/"
                        onClick={() => {
                          start();
                          timer.start();
                        }}
                      >
                        <SportsScore /> Start new
                      </Link>
                    </li>
                    <li>
                      <Link to="/" onClick={() => clear(game)}>
                        <BorderAll /> Clear board
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="sidebar-dropdown">
                <Link to="/">
                  <span className="svg-wrapper">
                    <Lightbulb />
                  </span>
                  <span className="text">Documentation</span>
                  <ChevronRight />
                </Link>
              </li>
            </ul>
          </div>
        </Box>
        <Box className="sidebar-footer">&nbsp;</Box>
      </Box>
    </Box>
  );
}
