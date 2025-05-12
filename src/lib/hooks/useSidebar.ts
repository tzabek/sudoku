import { use, useEffect, useReducer } from 'react';
import {
  SidebarState,
  SidebarActionProps,
  saveSidebar,
  loadSidebar,
  createSidebar,
} from '../libs/sidebar';
import { useTimer } from '.';

import GameContext from '../context/game-context';

function sidebarReducer(
  state: SidebarState,
  action: SidebarActionProps
): SidebarState {
  switch (action.type) {
    case 'create-sidebar': {
      return createSidebar();
    }
    case 'load-sidebar': {
      const saved = loadSidebar();

      if (saved) {
        return loadSidebar();
      }

      return state;
    }
    case 'toggle-menu': {
      return saveSidebar({
        ...state,
        menu: {
          docs: { ...state.menu.docs },
          game: {
            isActive: !state.menu.game.isActive,
          },
        },
      });
    }
    case 'toggle-sidebar': {
      return saveSidebar({
        ...state,
        isVisible: !state.isVisible,
      });
    }
    default: {
      return state;
    }
  }
}

export default function useSidebar() {
  const [state, dispatch] = useReducer(sidebarReducer, undefined, loadSidebar);

  const { game, start, clear, pause, resume } = use(GameContext);
  const { game: board, editableCells: editable } = game;

  const timer = useTimer({ game });
  const progressProps = { board, editable };
  const isPaused = game.status === 'paused';

  // Load sidebar
  useEffect(() => {
    const saved = loadSidebar();

    if (saved.id) {
      dispatch({ type: 'load-sidebar' });
    } else {
      dispatch({ type: 'create-sidebar' });
    }
  }, []);

  // Save sidebar to storage whenever it changes
  useEffect(() => {
    if (state.id) {
      saveSidebar(state);
    }
  }, [state]);

  return {
    toggles: {
      toggleSidebar: () => dispatch({ type: 'toggle-sidebar' }),
      toggleGameMenu: () => dispatch({ type: 'toggle-menu' }),
    },
    actions: { start, clear, pause, resume },
    data: { game, timer, progressProps, sidebar: state, isPaused },
  };
}
