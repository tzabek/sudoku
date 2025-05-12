import { ChangeEvent, use, useRef } from 'react';
import { SudokuCell } from '..';
import { SudokuCellRef } from '../../lib/libs/game';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const ctx = use(GameContext);
  const {
    game: { game: board, editableCells },
    update,
  } = ctx;

  const sudokuCellRef = useRef<SudokuCellRef>(null);

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
              <SudokuCell
                key={key}
                ref={sudokuCellRef}
                col={colIdx}
                row={rowIdx}
                editable={editableCells}
                board={board}
                value={value}
                onUpdate={(e) => handleInputChange(e, rowIdx, colIdx)}
                onActivateHint={() =>
                  sudokuCellRef.current?.activateHint(rowIdx, colIdx)
                }
              />
            );
          })
        )}
      </section>
    </form>
  );
}

Sudoku.displayName = 'Sudoku';

export default Sudoku;
