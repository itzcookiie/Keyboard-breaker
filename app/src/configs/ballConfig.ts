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
            const y = board.data.y - BALL_SETTINGS.radius;
            return {
                x,
                y
            };
        } else {
            const {x: boardX, y: boardY} = BoardConfig.generatePosition(game);
            const x = boardX + (BOARD_SETTINGS.width / 2);
            const y = boardY - BALL_SETTINGS.radius;
            return {
                x,
                y
            };
        };

    }

    private static levelOne(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: 2.5,
            yVelocity: 2.5
        };
    }

    private static levelTwo(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: 2.5,
            yVelocity: 2.5
        };
    }

    private static levelThree(game: Game): BallLevel {
        return {
            ...this.calculateStartPos(game),
            xVelocity: 5.5,
            yVelocity: 5.5
        };
    }
}

export default BallConfig;