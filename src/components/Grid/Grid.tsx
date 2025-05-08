import { GridProps } from '../../lib/libs/game';

import './Grid.css';

export default function Grid({ children }: GridProps) {
  return (
    <div className="grid" id="sudoku">
      {children}
    </div>
  );
}
