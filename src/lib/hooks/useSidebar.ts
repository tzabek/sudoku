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
  INITIAL_SIDEBAR,
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
      return loadSidebar();
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
  const [state, dispatch] = useReducer(sidebarReducer, INITIAL_SIDEBAR);

  const { game, start, clear, pause, resume } = use(GameContext);

  const timer = useTimer({ game });
  const isPaused = game.status === 'paused';

  // Load sidebar
  useEffect(() => {
    dispatch({ type: 'load-sidebar' });
  }, []);

  // Save sidebar to storage whenever it changes
  useEffect(() => {
    saveSidebar(state);
  }, [state]);

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
