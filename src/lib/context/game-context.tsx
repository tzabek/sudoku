import { createContext } from 'react';
import { IGameContext, INITIAL_GAME_CONTEXT } from '../libs/game';

const GameContext = createContext<IGameContext>(INITIAL_GAME_CONTEXT);

export default GameContext;
