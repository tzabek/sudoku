import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { useSudoku } from './lib/hooks';
import { Sidebar, Sudoku } from './components';

import GameContext from './lib/context/game-context';

function App() {
  const { contextValue } = useSudoku();

  return (
    <GameContext value={contextValue}>
      <BrowserRouter>
        <Suspense fallback="Loading...">
          <Sidebar />
        </Suspense>
        <Routes>
          <Route path="/" element={<Sudoku />} />
        </Routes>
      </BrowserRouter>
    </GameContext>
  );
}

export default App;
