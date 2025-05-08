import { CellProps } from '../../lib/types';

export default function GridColumn({ cellId, row, col, children }: CellProps) {
  return (
    <div className="grid-cell" id={cellId} data-row={row} data-col={col}>
      {children}
    </div>
  );
}
