import { use, useCallback, useState, useRef, useEffect } from 'react';
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
  createSidebarStorage,
  INITIAL_SIDEBAR_STATE,
  SidebarState,
} from '../libs/sidebar';
import { getElapsedTime } from '../libs/shared/utils';

import GameContext from '../context/game-context';

export default function useSidebar() {
  const [sidebar, setSidebar] = useState(INITIAL_SIDEBAR_STATE);
  const [elapsed, setElapsed] = useState<string | null>(null);

  const { game, start, clear, pause, resume } = use(GameContext);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = game.status === 'paused';

  const handleCheckSolution = () => {
    dialogRef.current?.show();
  };

  const handleLoadSidebar = useCallback(function handleLoadSidebar() {
    const storage = createSidebarStorage();
    const data = storage.get();

    setSidebar(data ?? storage.set(INITIAL_SIDEBAR_STATE));
  }, []);

  const handleSaveSidebar = (data: SidebarState) => {
    const storage = createSidebarStorage();
    setSidebar(storage.set(data));
  };

  const toggleSidebar = () => {
    handleSaveSidebar({
      ...sidebar,
      isVisible: !sidebar.isVisible,
    });
  };

  const toggleGameMenu = () => {
    handleSaveSidebar({
      ...sidebar,
      menu: {
        docs: { ...sidebar.menu.docs },
        game: {
          isActive: !sidebar.menu.game.isActive,
        },
      },
    });
  };

  useEffect(() => {
    handleLoadSidebar();
  }, [handleLoadSidebar]);

  const handleTimer = useCallback(function handleTimer(time: string) {
    setElapsed(time);
  }, []);

  useEffect(() => {
    const { timerActive, startedDate } = game;

    if (timerActive) {
      intervalRef.current = setInterval(() => {
        handleTimer(getElapsedTime(new Date(startedDate)));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [game, handleTimer]);

  return {
    toggles: { toggleSidebar, toggleGameMenu },
    actions: {
      start,
      clear,
      pause,
      resume,
      handleCheckSolution,
      handleSaveSidebar,
    },
    data: {
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
      dialog: dialogRef,
      game,
      sidebar,
      elapsed,
      isPaused,
    },
  };
}
