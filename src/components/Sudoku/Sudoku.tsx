import { ChangeEvent, use, useRef } from 'react';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const ctx = use(GameContext);
  const {
    game: { game: board, editableCells },
    update,
  } = ctx;

  const ref = useRef<HTMLInputElement | null>(null);

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
            const classes = [
              'cell',
              ...(!editableCells[rowIdx][colIdx] ? ['prefilled'] : []),
            ].join(' ');

            return (
              <div
                className={classes}
                key={key}
                data-x={colIdx}
                data-y={rowIdx}
              >
                <input
                  ref={ref}
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
