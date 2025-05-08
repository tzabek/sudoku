import { use } from 'react';

import GameContext from '../../lib/context/game-context';
import Grid from '../Grid/Grid';
import GridColumn from '../GridColumn/GridColumn';
import GridCell from '../GridCell/GridCell';
import Input from '../Input/Input';

function Sudoku() {
  const {
    game: { game: board, editableCells },
    updateCell,
  } = use(GameContext);

  return (
    <div className="container">
      <Grid>
        {board.map((column, columnIndex) => {
          const columnId = crypto.randomUUID();

          return (
            <GridColumn columnId={columnId} key={columnId}>
              {column.map((value, cellIndex) => {
                const cellId = crypto.randomUUID();

                return (
                  <GridCell
                    key={cellId}
                    cellId={cellId}
                    row={columnIndex}
                    col={cellIndex}
                  >
                    <Input
                      key={cellId}
                      value={value}
                      editable={editableCells[columnIndex][cellIndex]}
                      row={columnIndex}
                      col={cellIndex}
                      onChange={updateCell}
                    />
                  </GridCell>
                );
              })}
            </GridColumn>
          );
        })}
      </Grid>
    </div>
  );
}

export default Sudoku;
