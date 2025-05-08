import { createContext } from 'react';
import { INITIAL_GAME_CONTEXT } from '../constants';
import { IGameContext } from '../types';

const GameContext = createContext<IGameContext>(INITIAL_GAME_CONTEXT);

export default GameContext;
