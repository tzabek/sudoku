import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SolutionModalProps } from '../../lib/types';

import './SolutionModal.css';

const SolutionModal = forwardRef(function SolutionModal(
  props: SolutionModalProps,
  ref
) {
  const { game, solvedGame } = props;

  const dialog = useRef<HTMLDialogElement>(null);
  const portal = document.getElementById('modal') as HTMLElement;
  const isSolved = game.every((row, rowIndex) =>
    row.every((val, cellIndex) => val === solvedGame[rowIndex][cellIndex])
  );

  useImperativeHandle(ref, () => {
    return {
      show() {
        dialog.current?.showModal();
      },
    };
  });

  return createPortal(
    <dialog ref={dialog} className="solution-modal">
      <h2>Solution: {isSolved ? 'Solved correctly' : 'Not solved'}</h2>
      <form method="dialog">
        <button type="submit">Close</button>
      </form>
    </dialog>,
    portal
  );
});

export default SolutionModal;
