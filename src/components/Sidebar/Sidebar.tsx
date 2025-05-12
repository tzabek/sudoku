import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import { AnimatePresence, motion } from 'motion/react';
import { useSidebar } from '../../lib/hooks';
import { formatTime } from '../../lib/libs/shared';
import { SidebarProps } from '../../lib/libs/sidebar';

import './Sidebar.scss';

export default function Sidebar(props: SidebarProps) {
  const { children } = props;
  const {
    toggles: { toggleSidebar, toggleGameMenu },
    actions: { start, pause, resume, clear },
    data: { game, timer, sidebar, isPaused, icons },
  } = useSidebar();
  const { FontAwesomeIcon, ...icon } = icons;

  return (
    <div
      className={[
        'page-wrapper',
        'chiller-theme',
        ...(sidebar.isVisible ? ['toggled'] : []),
      ].join(' ')}
    >
      <Link
        to="/"
        id="show-sidebar"
        onClick={toggleSidebar}
        className="btn btn-sm btn-dark"
      >
        <FontAwesomeIcon icon={icon.faBars} />
      </Link>

      <nav id="sidebar" className="sidebar-wrapper">
        <div className="sidebar-content">
          <div className="sidebar-brand">
            <Link to="/">
              <FontAwesomeIcon icon={icon.faPuzzlePiece} className="logo" />{' '}
              Sudoku
            </Link>
            <div id="close-sidebar">
              <FontAwesomeIcon icon={icon.faTimes} onClick={toggleSidebar} />
            </div>
          </div>

          <div className="sidebar-header">
            <div className="game-info">
              <span className="game-status">
                <FontAwesomeIcon
                  icon={icon.faHeadset}
                  className={`${'headset'} status-${game.status}`}
                />{' '}
                <span>{capitalize(game.status)}</span>{' '}
              </span>
              <span className="game-timer">
                <FontAwesomeIcon icon={icon.faClockFour} />{' '}
                <span>{formatTime(timer.elapsedMs)}</span>
              </span>
            </div>
            <div className="game-actions">
              <div className="button-group">
                <button
                  type="button"
                  className={isPaused ? 'resume-game' : 'pause-game'}
                  onClick={() => {
                    if (isPaused) {
                      resume(game);
                      timer.resume();
                    } else {
                      pause(game);
                      timer.pause();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={isPaused ? icon.faGamepad : icon.faPause}
                  />
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar-subheader">
            <div className="game-hint">
              <AnimatePresence mode="popLayout">
                <motion.div id="game-hint" />
              </AnimatePresence>
            </div>
            <div id="game-progress-bar" />
          </div>

          <div className="sidebar-menu">
            <ul>
              <li
                className={[
                  'sidebar-dropdown',
                  ...(sidebar.menu.game.isActive ? ['active'] : []),
                ].join(' ')}
              >
                <Link to="/" onClick={toggleGameMenu}>
                  <span className="svg-wrapper">
                    <FontAwesomeIcon icon={icon.faPuzzlePiece} />
                  </span>
                  <span className="text">Game</span>
                  <FontAwesomeIcon
                    icon={
                      sidebar.menu.game.isActive
                        ? icon.faChevronDown
                        : icon.faChevronRight
                    }
                    className="chevron"
                  />
                </Link>
                <div
                  className="sidebar-submenu"
                  style={{
                    display: sidebar.menu.game.isActive ? 'block' : 'none',
                  }}
                >
                  <ul>
                    <li>
                      <Link
                        to="/"
                        onClick={() => {
                          start();
                          timer.start();
                        }}
                      >
                        <FontAwesomeIcon icon={icon.faFlagCheckered} />
                        Start new
                      </Link>
                    </li>
                    <li>
                      <Link to="/" onClick={() => clear(game)}>
                        <FontAwesomeIcon icon={icon.faBorderAll} />
                        Clear board
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="sidebar-dropdown">
                <Link to="/">
                  <span className="svg-wrapper">
                    <FontAwesomeIcon icon={icon.faLightbulb} />
                  </span>
                  <span className="text">Documentation</span>
                  <FontAwesomeIcon
                    icon={icon.faChevronRight}
                    className="chevron"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="sidebar-footer">&nbsp;</div>
      </nav>

      <div className="page-content">{children}</div>
    </div>
  );
}
