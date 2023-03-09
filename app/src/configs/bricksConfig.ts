import { GameLevel } from '../game';


type BrickLevels = {
    [key in GameLevel]: {
        startPos: [number, number];
        gap: number;
    };
}

export const BRICK_SETTINGS = {
    width: 50,
    height: 50,
    color: '#FFFFFF',
    keyColour: '#2596BE'
}


export class BricksLevelConfig {
    keys = [
        ['1234567890'],
        ['ASDFGHJKL;'],
        ['ZXCVBNM,./'],
    ];
    // Improvement: Use array and add a level field on each object. 
    // Then match level field with GameLevel enum number
    brickLevels: BrickLevels = {
        [GameLevel.ONE]: {
            startPos: [100, 200],
            gap: 10
        },
        [GameLevel.TWO]: {
            startPos: [100, 200],
            gap: 10
        },
        [GameLevel.THREE]: {
            startPos: [100, 200],
            gap: 10
        },
    };

    getConfig(level: GameLevel): BrickLevels[keyof BrickLevels] {
        return this.brickLevels[level];
    }

    generateBrickPositions(level: GameLevel) {
        const { startPos, gap } = this.getConfig(level);
        const [xStartPos, yStartPos] = startPos;
        return this.keys.flatMap((keyRow, rowIndex) => 
            keyRow.join('').split('').map((key, colIndex) => ({
                x: xStartPos + (colIndex * BRICK_SETTINGS.width) + gap,
                y: yStartPos + (rowIndex * BRICK_SETTINGS.height) + gap,
                key
            })
        ));
    }
}