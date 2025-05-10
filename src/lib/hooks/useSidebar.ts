import { use, useEffect, useReducer } from 'react';
import {
  FontAwesomeIcon,
  faBars,
  faTimes,
  faPuzzlePiece,
  faCircle,
  faChevronDown,
  faChevronRight,
  faLightbulb,
  faBell,
  faFlagCheckered,
  faFloppyDisk,
  faBorderAll,
  faClipboardQuestion,
  faClockFour,
  faHeadset,
  faPause,
  faGamepad,
  SidebarState,
  SidebarActionProps,
  saveSidebar,
  loadSidebar,
} from '../libs/sidebar';

import GameContext from '../context/game-context';
import { useTimer } from '.';

function sidebarReducer(
  state: SidebarState,
  action: SidebarActionProps
): SidebarState {
  switch (action.type) {
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

  const timer = useTimer({ game });
  const isPaused = game.status === 'paused';

  // Load sidebar
  useEffect(() => {
    const saved = loadSidebar();

    if (saved) {
      dispatch({ type: 'load-sidebar' });
    }
  }, []);

  // Save sidebar to storage whenever it changes
  useEffect(() => {
    console.log(state);
    if (state.id) {
      console.log(state.id);
      saveSidebar(state);
    }
  }, [state]);

  useEffect(() => {});

  return {
    toggles: {
      toggleSidebar: () => dispatch({ type: 'toggle-sidebar' }),
      toggleGameMenu: () => dispatch({ type: 'toggle-menu' }),
    },
    actions: { start, clear, pause, resume },
    data: {
      game,
      timer,
      sidebar: state,
      isPaused,
      icons: {
        FontAwesomeIcon,
        faBars,
        faTimes,
        faPuzzlePiece,
        faCircle,
        faChevronDown,
        faChevronRight,
        faLightbulb,
        faBell,
        faFlagCheckered,
        faFloppyDisk,
        faBorderAll,
        faClipboardQuestion,
        faClockFour,
        faHeadset,
        faPause,
        faGamepad,
      },
    },
  };
}
