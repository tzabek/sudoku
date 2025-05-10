import { use } from 'react';
import { Input } from '..';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const {
    game: { game: board, editableCells },
    update,
  } = use(GameContext);

  return (
    <form>
      <section id="board" className="sudoku-board">
        {board.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const key = crypto.randomUUID();

            return (
              <div className="cell" key={key}>
                <Input
                  value={value}
                  editable={editableCells[rowIdx][colIdx]}
                  row={rowIdx}
                  col={colIdx}
                  onChange={update}
                />
              </div>
            );
          })
        )}
      </section>
    </form>
  );
}

export default Sudoku;
