import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Portal } from '@mui/material';
import {
  SudokuHintProps,
  SudokuCellProps,
  SudokuCellRef,
} from '../../lib/libs/game';
import { SudokuHint } from '..';
import { useCandidates } from '../../lib/hooks';

const SudokuCell = forwardRef(function SudokuCell(
  props: SudokuCellProps,
  ref: ForwardedRef<SudokuCellRef>
) {
  const {
    row: y,
    col: x,
    editable,
    board,
    value,
    onUpdate,
    onActivateHint,
  } = props;

  const [activeHint, setActiveHint] = useState<SudokuHintProps>(null);

  const classes = ['cell', ...(!editable[y][x] ? ['prefilled'] : [])];
  const portal = document.getElementById('game-hint') as HTMLElement;
  const candidates = useCandidates(board, editable);

  useImperativeHandle(ref, () => ({
    activateHint: (row, col) => {
      setActiveHint(candidates[row][col]);
    },
    getActiveHint: () => activeHint,
    isActiveHint: () => !!activeHint,
  }));

  useEffect(() => {}, [activeHint, onActivateHint]);

  return (
    <div className={classes.join(' ')} data-x={x} data-y={y}>
      <input
        id={`${y}-${x}`}
        type="text"
        maxLength={1}
        value={value === 0 ? '' : value}
        onChange={(e) => onUpdate(e, y, x)}
        onFocus={() => setActiveHint(candidates[y][x])}
        onBlur={() => setActiveHint(null)}
        readOnly={!editable[y][x]}
        data-row={y}
        data-col={x}
      />

      {activeHint && (
        <Portal container={() => portal}>
          <SudokuHint candidates={activeHint} />
        </Portal>
      )}
    </div>
  );
});

SudokuCell.displayName = 'SudokuCell';

export default SudokuCell;
