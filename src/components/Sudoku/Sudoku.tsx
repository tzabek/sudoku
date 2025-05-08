import { use } from 'react';
import { Grid, GridCell, GridColumn, Input } from '..';

import GameContext from '../../lib/context/game-context';

function Sudoku() {
  const {
    game: { game: board, editableCells },
    update,
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
                      onChange={update}
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
