import { ChangeEvent } from 'react';
import { InputProps } from '../../lib/libs/game';

function Input(props: InputProps) {
  const { value, editable, row, col, onChange } = props;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onChange(row, col, Number.isNaN(num) ? 0 : num);
  };

  return (
    <input
      id={`${row}-${col}`}
      type="text"
      maxLength={1}
      value={value === 0 ? '' : value}
      onChange={handleInputChange}
      readOnly={!editable}
    />
  );
}

export default Input;
