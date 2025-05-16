import { use } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from 'react-mui-sidebar';
import { Box, Divider, List, ListSubheader, Typography } from '@mui/material';
import { pink } from '@mui/material/colors';
import { Extension } from '@mui/icons-material';
import { NumberTracker, Progress } from '..';

import GameContext from '../../lib/context/game-context';

import './SidePanel.scss';

function SidePanel() {
  const { game } = use(GameContext);
  const { game: board, editableCells: editable } = game;

  return (
    <Sidebar mode="dark" showProfile={false}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {/* Game branding */}
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

            {/* Progress bar */}
            <Box className="sidebar-header header-progress-bar">
              {!!board.length && !!editable.length && (
                <Progress board={board} editable={editable} />
              )}
            </Box>

            <Divider aria-hidden="true" component="div" />

            {/* Number tracker */}
            <Box className="sidebar-header header-number-tracker">
              {!!board.length && <NumberTracker board={board} />}
            </Box>
          </ListSubheader>
        }
      />
    </Sidebar>
  );
}

SidePanel.displayName = 'SidePanel';

export default SidePanel;
