import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Tooltip, Zoom } from '@mui/material';
import {
  ALLOWED_INPUT,
  CellFocus,
  HintProps,
  ICell,
  ICellRef,
} from '../../lib/libs/game';
import { useCandidates } from '../../lib/hooks';

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

const SudokuCell = forwardRef(function SudokuCell(
  props: ICell,
  ref: ForwardedRef<ICellRef>
) {
  const {
    row: y,
    col: x,
    editable,
    board,
    value,
    status,
    onUpdate,
    onActivateFocus,
    onActivateHint,
  } = props;

  const [activeHint, setActiveHint] = useState<HintProps>(null);
  const [focusedCell, setFocusedCell] = useState<CellFocus | null>(null);

  const isComplete = status === 'completed';
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = [
    'cell',
    ...(!editable[y][x] ? ['prefilled'] : [...(isComplete ? ['solved'] : [])]),
  ];
  const candidates = useCandidates(board, editable);

  useImperativeHandle(ref, () => ({
    activateHint: (row, col) => {
      setActiveHint(candidates[row][col]);
    },
    getActiveHint: () => activeHint,
    isActiveHint: () => !!activeHint,
    activateFocus: (row, col) => {
      setFocusedCell({ row, col });
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {}, [
    activeHint,
    onActivateHint,
    focusedCell,
    onActivateFocus,
  ]);

  return (
    <Tooltip
      title={getCandidates(candidates[y][x])}
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
          maxLength={1}
          value={value === 0 ? '' : value}
          onChange={(e) => onUpdate(e, y, x)}
          onFocus={() => {
            setActiveHint(candidates[y][x]);
            setFocusedCell({ row: y, col: x });
          }}
          onBlur={() => setActiveHint(null)}
          onKeyDown={(e) => {
            if (!ALLOWED_INPUT.includes(e.key)) {
              e.preventDefault();
            }
          }}
          readOnly={!editable[y][x] || isComplete}
          data-row={y}
          data-col={x}
        />
      </div>
    </Tooltip>
  );
});

SudokuCell.displayName = 'SudokuCell';

export default SudokuCell;
