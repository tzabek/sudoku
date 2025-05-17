import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Avatar, Box, styled, Tooltip, Zoom } from '@mui/material';
import { green, pink } from '@mui/material/colors';
import {
  ALLOWED_INPUT,
  CellFocus,
  HintProps,
  ICell,
  ICellRef,
  NUMERIC_INPUT,
} from '../../lib/libs/game';
import { useCandidates } from '../../lib/hooks';

const Candidate = styled(Avatar)(() => ({
  width: 12,
  height: 12,
  backgroundColor: green[500],
  '&:hover': {
    animation: 'ripple 0.75s infinite ease-in-out',
    backgroundColor: pink[500],
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.5)',
      opacity: 0.8,
    },
  },
}));

/**
 * Generates a JSX element that displays information about Sudoku cell candidates.
 */
function getCandidates(candidates: number[] | null) {
  if (!candidates) {
    return null;
  }

  const hasCandidates = !!candidates.length;
  const body = hasCandidates ? (
    <span>
      {candidates.length > 1 ? 'Possible candidates' : 'Remaining candidate'}:{' '}
      <strong>
        {new Intl.ListFormat('en', {
          style: 'short',
          type: 'disjunction',
        }).format(candidates.map((c) => String(c)))}
      </strong>
    </span>
  ) : (
    <span>No possible candidates.</span>
  );

  return body;
}

/**
 * A React functional component representing a single cell in a Sudoku board.
 * This component is designed to handle user interactions, display hints, and manage focus states.
 * It uses React's `forwardRef` to expose imperative methods for external control.
 *
 * @component
 *
 * @remarks
 * - The component uses `useImperativeHandle` to expose methods for activating hints and focus externally.
 * - The `Tooltip` component is used to display candidate numbers as hints.
 * - The cell is styled dynamically based on its state (e.g., prefilled, solved).
 * - Input validation ensures only allowed keys are accepted.
 *
 * @method activateHint
 * Activates a hint for the cell at the specified row and column.
 *
 * @method activateFocus
 * Activates focus for the cell at the specified row and column after cell update.
 */
const SudokuCell = forwardRef(function SudokuCell(
  props: ICell,
  ref: ForwardedRef<ICellRef>
) {
  const {
    row: y,
    col: x,
    editable,
    board,
    cell,
    value,
    status,
    isNotesMode,
    onUpdate,
    onActivateFocus,
    onActivateHint,
  } = props;
  const { value: cellValue, candidates: notes, isInitial } = cell;

  const [activeHint, setActiveHint] = useState<HintProps>(null);
  const [focusedCell, setFocusedCell] = useState<CellFocus | null>(null);

  const isFocused = focusedCell?.row === y && focusedCell?.col === x;
  const isComplete = status === 'completed';
  const inputRef = useRef<HTMLInputElement>(null);
  const candidates = useCandidates(board, editable);
  const tooltipTitle = getCandidates(candidates[y][x]);
  const classes = [
    'cell-wrapper',
    ...(isInitial ? ['prefilled'] : [...(isComplete ? ['solved'] : [])]),
    ...(isNotesMode ? ['notes-mode-wrapper'] : []),
  ];

  useImperativeHandle(ref, () => ({
    activateHint: (row, col) => {
      setActiveHint(candidates[row][col]);
    },
    activateFocus: (row, col) => {
      setFocusedCell({ row, col });
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (focusedCell) {
      inputRef.current?.focus();
    }
  }, [activeHint, focusedCell, onActivateHint, onActivateFocus]);

  // Standard input cell for entering final number
  if (cellValue || !isNotesMode) {
    return (
      <Tooltip
        title={tooltipTitle}
        placement="top"
        disableInteractive
        followCursor
        slots={{ transition: Zoom }}
      >
        <div className={classes.join(' ')} data-x={x} data-y={y}>
          <input
            ref={inputRef}
            autoComplete="off"
            id={`${y}-${x}`}
            type="text"
            inputMode="numeric"
            className="sudoku-cell final-input"
            maxLength={1}
            value={value === 0 ? '' : value}
            onChange={(e) => {
              const input = Number(e.target.value);
              const newValue = Number.isNaN(input) ? 0 : input;

              onUpdate(y, x, newValue);
            }}
            onFocus={() => {
              setActiveHint(candidates[y][x]);
              setFocusedCell({ row: y, col: x });
            }}
            onBlur={() => {
              setActiveHint(null);
              setFocusedCell(null);
            }}
            onKeyDown={(e) => {
              if (!ALLOWED_INPUT.includes(e.key)) {
                e.preventDefault();
              }
            }}
            readOnly={isInitial || isComplete || isNotesMode}
            data-row={y}
            data-col={x}
          />
        </div>
      </Tooltip>
    );
  }

  // Notes input for entering cell candidates
  if (isFocused || !notes.length) {
    return (
      <div className={classes.join(' ')} data-x={x} data-y={y}>
        <input
          ref={inputRef}
          autoComplete="off"
          id={`${y}-${x}`}
          type="text"
          inputMode="numeric"
          className="sudoku-cell notes-input"
          maxLength={1}
          value=""
          onChange={(e) => {
            const input = Number(e.target.value);
            const newValue = Number.isNaN(input) ? 0 : input;

            onUpdate(y, x, newValue);
          }}
          onFocus={() => {
            setFocusedCell({ row: y, col: x });
          }}
          onBlur={() => setFocusedCell(null)}
          onKeyDown={(e) => {
            if (!ALLOWED_INPUT.includes(e.key)) {
              e.preventDefault();
            }
          }}
          readOnly={isInitial || isComplete}
          data-row={y}
          data-col={x}
        />
      </div>
    );
  }

  // Cell candidates chosen by user
  return (
    <Box
      className="cell-wrapper candidates-wrapper candidates"
      onClick={() => {
        setFocusedCell({ row: y, col: x });
      }}
    >
      {NUMERIC_INPUT.map((n) => (
        <Candidate
          key={n}
          variant="square"
          className={`note sudoku-cell candidate${
            notes.includes(n) ? ' visible' : ''
          }`}
          onClick={() => {
            if (notes.includes(n)) {
              onUpdate(y, x, n);
            }
          }}
        >
          {notes.includes(n) ? n : ''}
        </Candidate>
      ))}
    </Box>
  );
});

SudokuCell.displayName = 'SudokuCell';

export default SudokuCell;
