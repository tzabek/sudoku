import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HintProps, SudokuCellProps, SudokuCellRef } from '../../lib/libs/game';
import { SudokuHint } from '..';

const SudokuCell = forwardRef(function SudokuCell(
  props: SudokuCellProps,
  ref: ForwardedRef<SudokuCellRef>
) {
  const { row: y, col: x, editable, value, onUpdate, onActivateHint } = props;

  const [activeHint, setActiveHint] = useState<HintProps | null>(null);

  const classes = ['cell', ...(!editable[y][x] ? ['prefilled'] : [])];
  const portal = document.getElementById('board-hint') as HTMLElement;

  useImperativeHandle(ref, () => ({
    activateHint: (row, col) => {
      setActiveHint({ row, col });
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
        onFocus={() => setActiveHint({ row: y, col: x })}
        onBlur={() => setActiveHint(null)}
        readOnly={!editable[y][x]}
        data-row={y}
        data-col={x}
      />
      {activeHint && createPortal(<SudokuHint />, portal)}
    </div>
  );
});

SudokuCell.displayName = 'SudokuCell';

export default SudokuCell;
