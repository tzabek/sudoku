import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSudoku } from './lib/hooks';
import { Sidebar, Sudoku } from './components';

import GameContext from './lib/context/game-context';

function App() {
  const { contextValue } = useSudoku();

  return (
    <GameContext value={contextValue}>
      <BrowserRouter>
        <Sidebar>
          <Routes>
            <Route path="/" element={<Sudoku />} />
          </Routes>
        </Sidebar>
      </BrowserRouter>
    </GameContext>
  );
}

export default App;
