import { ColumnProps } from '../../lib/types';

export default function GridColumn({ columnId, children }: ColumnProps) {
  return (
    <div className="grid-column" id={columnId}>
      {children}
    </div>
  );
}
