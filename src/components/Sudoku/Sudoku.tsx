import { ChangeEvent, use } from 'react';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const ctx = use(GameContext);
  const {
    game: { game: board, editableCells },
    update,
  } = ctx;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const num = Number(e.target.value);
    update(row, col, Number.isNaN(num) ? 0 : num);
  };

  return (
    <form>
      <section id="board" className="sudoku-board">
        {board.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const key = crypto.randomUUID();

            return (
              <div className="cell" key={key}>
                <input
                  id={`${rowIdx}-${colIdx}`}
                  type="text"
                  maxLength={1}
                  value={value === 0 ? '' : value}
                  onChange={(e) => handleInputChange(e, rowIdx, colIdx)}
                  readOnly={!editableCells[rowIdx][colIdx]}
                  data-row={rowIdx}
                  data-col={colIdx}
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
