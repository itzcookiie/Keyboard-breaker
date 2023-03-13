import Game, { GameLevel } from '../game';
import BoardConfig from './boardConfig';
import { BALL_SETTINGS, BOARD_SETTINGS } from '../constants';
import { Vector } from '../types';


interface BallLevel {
    startPos: [number, number];
}

type BallLevels = {
    [key in GameLevel]: BallLevel;
}


class BallConfig {
    static getPositions(game: Game): Vector {
        const { startPos } = this.getConfig(game);
        const [x, y] = startPos;
        return {
            x,
            y
        }
    }

    private static getConfig(game: Game): BallLevels[keyof BallLevels] {
        return this.generateLevels(game)[game.level];
    }

    // Improvement: Use array and add a level field on each object. 
    // Then match level field with GameLevel enum number
    private static generateLevels(game: Game): BallLevels {
        return {
            [GameLevel.ONE]: this.levelOne(game),
            [GameLevel.TWO]: this.levelTwo(game),
            [GameLevel.THREE]: this.levelThree(game),
        }
    }

    private static calculateStartPos(game: Game): BallLevel {
        const {x: boardX, y: boardY} = BoardConfig.generatePosition(game);
        const boardMidX = boardX + (BOARD_SETTINGS.width / 2);
        const x = boardMidX;
        const y = boardY - BALL_SETTINGS.radius;
        return {
            startPos: [x, y]
        }
    }

    private static levelOne(game: Game): BallLevel {
        return this.calculateStartPos(game);
    }

    private static levelTwo(game: Game): BallLevel {
        return this.calculateStartPos(game);
    }

    private static levelThree(game: Game): BallLevel {
        return this.calculateStartPos(game);
    }
}

export default BallConfig;