import { GameLevel } from './game';


type BrickLevels = {
    [key in GameLevel]: {
        startPos: [number, number];
        gap: number;
    };
}

const BRICK_SIZE = {
    width: 50,
    height: 50
}


class BricksLevelConfig {
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

    // TEST FUNCTION WORKS!
    generateBrickPositions(level: GameLevel) {
        const config = this.getConfig(level);
        const [xStartPos, yStartPos] = config.startPos;
        const expandedKeys = this.keys.map(keyRow => keyRow.join('').split(''));
        const keyObjects = expandedKeys.map((expandedKeyRow, rowIndex) => 
        expandedKeyRow.map((key, colIndex) => {
            const x = xStartPos + (colIndex * BRICK_SIZE.width) + config.gap;
            const y = yStartPos + (rowIndex * BRICK_SIZE.height) + config.gap;
            return {x, y, key}
        }));
        return keyObjects.flatMap(k => k);
    }
} 