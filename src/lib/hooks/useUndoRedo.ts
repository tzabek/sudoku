import { useCallback, useState } from 'react';
import { CellChange } from '../libs/game';

export default function useUndoRedo() {
  const [history, setHistory] = useState<CellChange[]>([]);
  const [future, setFuture] = useState<CellChange[]>([]);

  const addChange = useCallback(function addChange(change: CellChange) {
    setHistory((prev) => [...prev, change]);
    setFuture([]);
  }, []);

  const undo = useCallback(
    (applyChange: (change: CellChange) => void) => {
      if (history.length === 0) {
        return;
      }

      const lastChange = history[history.length - 1];

      applyChange({ ...lastChange, newValue: lastChange.previousValue });

      setHistory((prev) => prev.slice(0, -1));
      setFuture((f) => [lastChange, ...f]);
    },
    [history]
  );

  const redo = useCallback(
    (applyChange: (change: CellChange) => void) => {
      if (future.length === 0) {
        return;
      }

      const nextChange = future[0];

      applyChange(nextChange);

      setHistory((h) => [...h, nextChange]);
      setFuture((f) => f.slice(1));
    },
    [future]
  );

  return {
    addChange,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    history,
    future,
  };
}
