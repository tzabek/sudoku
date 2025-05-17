import { createRef, RefObject, use, useRef } from 'react';
import { Box } from '@mui/material';
import { SudokuCell, Timer, Toolbar, VictoryModal } from '..';
import { createChangeBatch, ICellRef } from '../../lib/libs/game';
import { deepCopy } from '../../lib/libs/shared';

import GameContext from '../../lib/context/game-context';

import './Sudoku.scss';

/**
 * The `Sudoku` component represents the main Sudoku game interface.
 * It provides a fully interactive Sudoku board, game controls, and a timer.
 * The component manages the game state, user interactions, and game logic
 * such as starting a new game, clearing the board, undoing/redoing moves,
 * and handling mistakes.
 *
 * @component
 *
 * @remarks
 * - The component uses the `GameContext` to manage the game state and actions.
 * - It includes a toolbar for game actions, a Sudoku board for user interaction,
 *   and a victory modal for when the game is completed.
 * - Mistakes are logged when the user enters an incorrect value.
 * - The board cells are managed using `useRef` to handle focus and hints dynamically.
 *
 * @dependencies
 * - `GameContext`: Provides the game state and actions.
 * - `Timer`: Displays the game timer.
 * - `SudokuCell`: Represents individual cells in the Sudoku board.
 * - `VictoryModal`: Displays a modal when the game is completed.
 *
 * @internal
 * - The `handleInputChange` function manages user input and updates the board state.
 * - The `setCellRef` function dynamically creates and manages references for board cells.
 *
 * @children
 * - `Timer`: Displays the elapsed time for the game.
 * - `SudokuCell`: Renders each cell in the Sudoku board.
 * - `VictoryModal`: Displays a modal when the game is won.
 * - `Toolbar`: Renders a toolbar for game actions
 */
function Sudoku() {
  const {
    game,
    applyBatch,
    logMistake,
    toggleCandidate,
    removeCandidateFromPeers,
  } = use(GameContext);
  const {
    game: board,
    cells,
    editableCells,
    solvedGame,
    status,
    notesMode,
  } = game;

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

  const handleInputChange = (row: number, col: number, val: number) => {
    const newBoard = deepCopy(board);
    const previousValue = board[row][col];

    if (previousValue === val) {
      return;
    }

    if (notesMode) {
      toggleCandidate(row, col, val);
    } else {
      newBoard[row][col] = val;

      // Log mistake
      if (val !== solvedGame[row][col]) {
        logMistake({
          row,
          col,
          enteredValue: val,
          correctValue: solvedGame[row][col],
          timestamp: Date.now(),
        });
      }

      // Apply changes
      applyBatch(createChangeBatch(board, newBoard));

      // Remove candidate from peers
      removeCandidateFromPeers(row, col, val);
    }
  };

  return (
    <Box component="form" autoComplete="off">
      {/* Sudoku Timer */}
      <Timer />

      {/* Sudoku Toolbar */}
      <Toolbar />

      {/* Sudoku Board */}
      <Box component="section" id="board" className="sudoku-board">
        {board.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const cell = cells[rowIdx][colIdx];

            return (
              <SudokuCell
                key={crypto.randomUUID()}
                ref={setCellRef(rowIdx, colIdx)}
                col={colIdx}
                row={rowIdx}
                editable={editableCells}
                board={board}
                cell={cell}
                value={value}
                status={status}
                onUpdate={(r, c, v) => {
                  handleInputChange(r, c, v);

                  // Don't re-focus in 'notes mode'
                  if (!notesMode) {
                    setTimeout(() => {
                      sudokuCellRef.current
                        ?.get(key)
                        ?.current?.activateFocus(rowIdx, colIdx);
                    });
                  }
                }}
                onActivateFocus={() => {
                  sudokuCellRef.current
                    ?.get(key)
                    ?.current?.activateFocus(rowIdx, colIdx);
                }}
                onActivateHint={() => {
                  sudokuCellRef.current
                    ?.get(key)
                    ?.current?.activateHint(rowIdx, colIdx);
                }}
                isNotesMode={notesMode}
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
