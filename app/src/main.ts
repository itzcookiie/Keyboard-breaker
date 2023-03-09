import './style.css';

import Game, { GameLevel } from './game';
import Bricks from './bricks';
import { BricksLevelConfig } from './configs/bricksConfig';


new Game();
const blc = new BricksLevelConfig();
console.log(blc.generateBrickPositions(GameLevel.ONE))