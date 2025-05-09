import { Link } from 'react-router-dom';
import { Badge, Button, ButtonGroup } from 'react-bootstrap';
import { capitalize } from 'lodash';
import { useSidebar, useTimer } from '../../lib/hooks';

import 'bootstrap/dist/css/bootstrap.css';
import './Sidebar.css';

export default function Sidebar() {
  const {
    toggles: { toggleSidebar, toggleGameMenu },
    actions: { start, clear, pause, resume },
    data: { sidebar, game, isPaused, icons },
  } = useSidebar();
  const { FontAwesomeIcon, ...icon } = icons;
  const timer = useTimer();

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
                <FontAwesomeIcon icon={icon.faClockFour} /> <span>TBC</span>
              </span>
            </div>
            <div className="game-actions">
              <ButtonGroup>
                <Button
                  variant="outline-light"
                  size="sm"
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
                </Button>
              </ButtonGroup>
            </div>
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
        <div className="sidebar-footer">
          <Link to="/">
            <Badge pill bg="primary">
              <FontAwesomeIcon icon={icon.faGamepad} />{' '}
              {sidebar.games.games.length}
            </Badge>{' '}
            games so far
          </Link>
        </div>
      </nav>
    </div>
  );
}
