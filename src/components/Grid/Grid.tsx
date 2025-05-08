import { GridProps } from '../../lib/types';

import './Grid.css';

export default function Grid({ children }: GridProps) {
  return (
    <div className="grid" id="sudoku">
      {children}
    </div>
  );
}
