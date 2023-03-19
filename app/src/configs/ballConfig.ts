import Game from '../game';
import BoardConfig from './boardConfig';
import { BALL_SETTINGS, BOARD_SETTINGS } from '../constants';
import { GameLevel, BallLevel } from '../types';
import Board from '../entities/board';


type BallLevels = {
    [key in GameLevel]: BallLevel;
};


class BallConfig {
    static getPositions(game: Game): BallLevel {
        const { x, y, xVelocity, yVelocity } = this.getConfig(game);
        return {
            x,
            y,
            xVelocity,
            yVelocity
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

    private static calculateStartPos(game: Game): Pick<BallLevel, 'x' | 'y'> {
        const board = game.getEntity(Board);
        if(board instanceof Board) {
            const x = board.data.x + (BOARD_SETTINGS.width / 2);
            // Make sure board doesn't touch board, so it doesn't think it's colliding with the board on game start
            const y = board.data.y - (2 * BALL_SETTINGS.radius);
            return {
                x,
                y
            };
        } else {
            const {x: boardX, y: boardY} = BoardConfig.generatePosition(game);
            const x = boardX + (BOARD_SETTINGS.width / 2);
            // Make sure board doesn't touch board, so it doesn't think it's colliding with the board on game start
            const y = boardY - (2 * BALL_SETTINGS.radius);
            return {
                x,
                y
            };
        };
    }

    private static levelOne(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: BALL_SETTINGS.level1.xVelocity,
            yVelocity: BALL_SETTINGS.level1.yVelocity
        };
    }

    private static levelTwo(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: BALL_SETTINGS.level2.xVelocity,
            yVelocity: BALL_SETTINGS.level2.yVelocity
        };
    }

    private static levelThree(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: BALL_SETTINGS.level3.xVelocity,
            yVelocity: BALL_SETTINGS.level3.yVelocity
        };
    }
}

export default BallConfig;