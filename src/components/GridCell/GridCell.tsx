import { CellProps } from '../../lib/libs/game';

export default function GridColumn({ cellId, row, col, children }: CellProps) {
  return (
    <div className="grid-cell" id={cellId} data-row={row} data-col={col}>
      {children}
    </div>
  );
}
