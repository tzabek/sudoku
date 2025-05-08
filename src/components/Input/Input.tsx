import { ChangeEvent } from 'react';
import { InputProps } from '../../lib/types';

import './Input.css';

function Input(props: InputProps) {
  const { value, editable, row, col, onChange } = props;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onChange(row, col, Number.isNaN(num) ? 0 : num);
  };

  return (
    <input
      id={`${row}-${col}`}
      name="sudoku-cell"
      type="text"
      maxLength={1}
      className={['cell-input', ...(!editable ? ['prefilled'] : [])].join(' ')}
      value={value === 0 ? '' : value}
      onChange={handleInputChange}
      disabled={!editable}
    />
  );
}

export default Input;
