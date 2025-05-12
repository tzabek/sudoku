import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useSudoku } from './lib/hooks';
import { SidePanel, Sudoku } from './components';

import GameContext from './lib/context/game-context';

function App() {
  const { contextValue } = useSudoku();
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameContext value={contextValue}>
        <BrowserRouter>
          <Container className="page-content">
            <SidePanel />
            <Box component="main">
              <Routes>
                <Route path="/" element={<Sudoku />} />
              </Routes>
            </Box>
          </Container>
        </BrowserRouter>
      </GameContext>
    </ThemeProvider>
  );
}

export default App;
