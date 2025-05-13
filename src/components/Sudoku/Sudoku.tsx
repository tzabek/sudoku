import { ChangeEvent, use, useRef } from 'react';
import { Box, Divider, IconButton } from '@mui/material';
import { Undo, Redo } from '@mui/icons-material';
import { SudokuCell } from '..';
import { SudokuCellRef } from '../../lib/libs/game';
import { useUndoRedo } from '../../lib/hooks';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const {
    game: { game: board, editableCells },
    update,
  } = use(GameContext);
  const { addChange, undo, redo, canUndo, canRedo, history, future } =
    useUndoRedo();

  const recentUndo = history[history.length - 1];
  const recentRedo = future[0];
  const sudokuCellRef = useRef<SudokuCellRef>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const previousValue = board[row][col];
    const input = Number(e.target.value);
    const newValue = Number.isNaN(input) ? 0 : input;

    if (previousValue === newValue) {
      return;
    }

    addChange({ row, col, previousValue, newValue });
    update(row, col, newValue);
  };

  return (
    <Box component="form">
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
            disabled={!canUndo}
            sx={{ borderRadius: 0 }}
            onClick={() =>
              undo(() =>
                update(
                  recentUndo.row,
                  recentUndo.col,
                  recentUndo.previousValue || 0
                )
              )
            }
          >
            <Undo />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Redo"
            size="small"
            disabled={!canRedo}
            sx={{ borderRadius: 0 }}
            onClick={() =>
              redo(() =>
                update(recentRedo.row, recentRedo.col, recentRedo.newValue || 0)
              )
            }
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
