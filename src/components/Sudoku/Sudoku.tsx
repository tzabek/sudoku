import { ChangeEvent, createRef, RefObject, use, useRef } from 'react';
import { Box, Divider, IconButton } from '@mui/material';
import {
  Undo,
  Redo,
  Pause,
  PlayArrow,
  DashboardCustomize,
  SystemUpdateAlt,
  GridView,
} from '@mui/icons-material';
import { SudokuCell, Timer, VictoryModal } from '..';
import { createChangeBatch, ICellRef } from '../../lib/libs/game';
import { deepCopy } from '../../lib/libs/shared';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

function Sudoku() {
  const { game, start, clear, apply, undo, redo, mistake, resume, pause } =
    use(GameContext);
  const { game: board, editableCells, solvedGame, history, status } = game;
  const { undoStack, redoStack } = history;

  // const sudokuCellRef = useRef<ICellRef>(null);
  const sudokuCellRef = useRef<Map<string, RefObject<ICellRef | null>>>(
    new Map()
  );

  const setCellRef = (row: number, col: number) => {
    const key = `${row}-${col}`;

    if (!sudokuCellRef.current.has(key)) {
      sudokuCellRef.current.set(key, createRef<ICellRef>());
    }

    return sudokuCellRef.current.get(key);
  };

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
    if (newValue !== solvedGame[row][col]) {
      mistake({
        row,
        col,
        enteredValue: newValue,
        correctValue: solvedGame[row][col],
        timestamp: Date.now(),
      });
    }

    // Apply changes
    apply(createChangeBatch(board, newBoard));
  };

  return (
    <Box component="form" autoComplete="off">
      {/* Sudoku Timer */}
      <Timer />

      {/* Sudoku Toolbar */}
      <Box
        component="section"
        id="game-toolbar"
        className="sudoku-toolbar"
        sx={{ display: 'flex' }}
      >
        <Box
          className="actions-toolbar"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            color: 'text.secondary',
            marginRight: 'auto',
          }}
        >
          <IconButton
            aria-label="Start new"
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={() => start()}
          >
            <DashboardCustomize />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Load game"
            size="small"
            sx={{ borderRadius: 0 }}
          >
            <SystemUpdateAlt />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Clear board"
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={() => clear(game)}
          >
            <GridView />
          </IconButton>
        </Box>
        <Box
          className="progress-toolbar"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            color: 'text.secondary',
            marginLeft: 'auto',
          }}
        >
          <IconButton
            aria-label={game.status === 'paused' ? 'Resume' : 'Pause'}
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={() =>
              game.status === 'paused' ? resume(game) : pause(game)
            }
          >
            {game.status === 'paused' ? <PlayArrow /> : <Pause />}
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Undo"
            size="small"
            disabled={!undoStack.length || status === 'completed'}
            sx={{ borderRadius: 0 }}
            onClick={() => undo()}
          >
            <Undo />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton
            aria-label="Redo"
            size="small"
            disabled={!redoStack.length || status === 'completed'}
            sx={{ borderRadius: 0 }}
            onClick={() => redo()}
          >
            <Redo />
          </IconButton>
        </Box>
      </Box>

      {/* Sudoku Board */}
      <Box component="section" id="board" className="sudoku-board">
        {board.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            return (
              <SudokuCell
                key={crypto.randomUUID()}
                ref={setCellRef(rowIdx, colIdx)}
                col={colIdx}
                row={rowIdx}
                editable={editableCells}
                board={board}
                value={value}
                status={status}
                onUpdate={(e) => {
                  handleInputChange(e, rowIdx, colIdx);
                  setTimeout(() => {
                    const key = `${rowIdx}-${colIdx}`;
                    sudokuCellRef.current
                      ?.get(key)
                      ?.current?.activateFocus(rowIdx, colIdx);
                  });
                }}
                onActivateFocus={() => {
                  const key = `${rowIdx}-${colIdx}`;
                  sudokuCellRef.current
                    ?.get(key)
                    ?.current?.activateFocus(rowIdx, colIdx);
                }}
                onActivateHint={() => {
                  const key = `${rowIdx}-${colIdx}`;
                  sudokuCellRef.current
                    ?.get(key)
                    ?.current?.activateHint(rowIdx, colIdx);
                }}
              />
            );
          })
        )}
      </Box>

      {/* Sudoku Victory Modal */}
      <VictoryModal />
    </Box>
  );
}

Sudoku.displayName = 'Sudoku';

export default Sudoku;
