import Game, { GameLevel } from '../game';
import { BOARD_SETTINGS } from '../constants';
import { Vector } from '../types';


interface BoardLevel {
    startPos: [number, number];
}

type BoardLevels = {
    [key in GameLevel]: BoardLevel;
}

class BoardConfig {
    static generatePosition(game: Game): Vector {
        const { startPos } = this.getConfig(game);
        const [x, y] = startPos;
        return {
            x,
            y
        }
    }

    private static getConfig(game: Game): BoardLevels[keyof BoardLevels] {
        return this.generateLevels(game)[game.level];
    }

    // Improvement: Use array and add a level field on each object. 
    // Then match level field with GameLevel enum number
    private static generateLevels(game: Game): BoardLevels {
        return {
            [GameLevel.ONE]: this.levelOne(game.canvas),
            [GameLevel.TWO]: this.levelTwo(game.canvas),
            [GameLevel.THREE]: this.levelThree(game.canvas),
        }
    }

    private static calculateStartPos(canvas: HTMLCanvasElement): BoardLevel {
        const x = (canvas.width - BOARD_SETTINGS.width) / 2;
        const y = canvas.height * 0.8;
        return {
            startPos: [x, y]
        };
    }

    private static levelOne(canvas: HTMLCanvasElement): BoardLevel {
        return this.calculateStartPos(canvas);
    }

    private static levelTwo(canvas: HTMLCanvasElement): BoardLevel {
        return this.calculateStartPos(canvas);
    }

    private static levelThree(canvas: HTMLCanvasElement): BoardLevel {
        return this.calculateStartPos(canvas);
    }

    
}

export default BoardConfig;