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
import { pink } from '@mui/material/colors';
import {
  Extension,
  ExpandMore,
  ExpandLess,
  DashboardCustomize,
  SportsEsports,
  BorderAll,
  CloudSync,
} from '@mui/icons-material';
import { NumberTracker, Progress } from '..';
import { useSidebar } from '../../lib/hooks';

import './SidePanel.scss';

function SidePanel() {
  const {
    actions: { start, clear },
    data: { game, timer, progressProps },
    menu: { showGameMenu, setShowGameMenu },
  } = useSidebar();
  const { board, editable } = progressProps;

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
      >
        <Divider aria-hidden="true" component="div" />
        <ListItemButton onClick={() => setShowGameMenu(!showGameMenu)}>
          <ListItemIcon>
            <SportsEsports />
          </ListItemIcon>
          <ListItemText primary="Game menu" />
          {showGameMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={showGameMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                start();
                timer.start();
              }}
            >
              <ListItemIcon>
                <DashboardCustomize />
              </ListItemIcon>
              <ListItemText primary="Start game" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <CloudSync />
              </ListItemIcon>
              <ListItemText primary="Load game" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => clear(game)}>
              <ListItemIcon>
                <BorderAll />
              </ListItemIcon>
              <ListItemText primary="Clear board" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Sidebar>
  );
}

SidePanel.displayName = 'SidePanel';

export default SidePanel;
