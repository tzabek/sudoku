import { ChangeEvent, use, useRef } from 'react';
import { Box, Divider, IconButton } from '@mui/material';
import { Undo, Redo } from '@mui/icons-material';
import { SudokuCell } from '..';
import { createChangeBatch, ICellRef } from '../../lib/libs/game';
import { deepCopy } from '../../lib/libs/shared';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const {
    game: {
      game: board,
      editableCells,
      solvedGame: solution,
      history: { undoStack, redoStack },
    },
    apply,
    undo,
    redo,
    mistake,
  } = use(GameContext);

  const sudokuCellRef = useRef<ICellRef>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const newBoard = deepCopy(board);
    const previousValue = board[row][col];
    const input = Number(e.target.value);
    const newValue = Number.isNaN(input) ? 0 : input;

    if (previousValue === newValue) {
      return;
    }

    newBoard[row][col] = newValue;

    // Log mistake
    if (newValue !== solution[row][col]) {
      mistake({
        row,
        col,
        enteredValue: newValue,
        correctValue: solution[row][col],
        timestamp: Date.now(),
      });
    }

    // Apply changes
    apply(createChangeBatch(board, newBoard));
  };

  return (
    <Box component="form" autoComplete="off">
      <Box component="section" id="game-toolbar" className="sudoku-toolbar">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            color: 'text.secondary',
          }}
        >
          <IconButton
            aria-label="Undo"
            size="small"
            disabled={!undoStack.length}
            sx={{ borderRadius: 0 }}
            onClick={() => undo()}
          >
            <Undo />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Redo"
            size="small"
            disabled={!redoStack.length}
            sx={{ borderRadius: 0 }}
            onClick={() => redo()}
          >
            <Redo />
          </IconButton>
        </Box>
      </Box>
      <Box component="section" id="board" className="sudoku-board">
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
      </Box>
    </Box>
  );
}

Sudoku.displayName = 'Sudoku';

export default Sudoku;
