import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSudoku } from './lib/hooks/useSudoku';

import GameContext from './lib/context/game-context';
import Sudoku from './components/Sudoku/Sudoku';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const { contextValue } = useSudoku();

  return (
    <GameContext value={contextValue}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Sudoku />} />
        </Routes>
      </BrowserRouter>
    </GameContext>
  );
}

export default App;
