import Game, { GameLevel } from '../game';


interface BrickLevel {
    startPos: [number, number];
    gap: number;
}

type BrickLevels = {
    [key in GameLevel]: BrickLevel;
}

export interface BrickData {
    x: number;
    y: number;
    key: string;
}


export const BRICK_SETTINGS = {
    width: 50,
    height: 50,
    color: '#FFFFFF',
    keyColour: '#2596BE',
    padding: 20
}

export const KEY_SETTINGS = {
    width: 40, // Longest text width (probably W?)
    height: 45, // Longest text height (think all the same)
    color: '#0039a6'
}


export class BricksConfig {
    // Add constructor since we are passing Game and use a lot of it's fields
    private static keys = [
        ['1234567'],
        ['QWERTYU'],
        ['ASDFGHJ'],
        ['ZXCVBNM'],
    ];

    private static getConfig(game: Game): BrickLevels[keyof BrickLevels] {
        return this.generateBrickLevels(game)[game.level];
    }

    // Improvement: Use array and add a level field on each object. 
    // Then match level field with GameLevel enum number
    private static generateBrickLevels(game: Game): BrickLevels {
        return {
            [GameLevel.ONE]: this.levelOne(game.canvas),
            [GameLevel.TWO]: this.levelTwo(game.canvas),
            [GameLevel.THREE]: this.levelThree(game.canvas),
        }
    }

    // static generateBrickPositions(game: Game): BrickData[] {
    //     const { startPos, gap } = this.getConfig(game);
    //     const [xStartPos, yStartPos] = startPos;
    //     const brickKeyHeightDiff = BRICK_SETTINGS.height - KEY_SETTINGS.height;
    //     return this.keys.flatMap((keyRow, rowIndex) => 
    //         keyRow.join('').split('').map((key, colIndex) => ({
    //             x: xStartPos - (KEY_SETTINGS.width / 2) - (BRICK_SETTINGS.padding / 2) + (colIndex * (BRICK_SETTINGS.width + gap + BRICK_SETTINGS.padding)),
    //             y: yStartPos - KEY_SETTINGS.height - (BRICK_SETTINGS.padding / 2) + (brickKeyHeightDiff) + (rowIndex * (BRICK_SETTINGS.height + gap + BRICK_SETTINGS.padding)),
    //             key
    //         })
    //     ));
    // }

    static generateBrickPositions(game: Game): BrickData[] {
        // Brick positions depend on key positions
        // Calculate key positions first, then get key positions
        // And adjust as needed based on brick padding and leftover height/width of keys
        // Basing calculatings currently on longest text height/width
        return this.generateKeyPositions(game).map(key => ({
            x: key.x - (KEY_SETTINGS.width / 2) - (BRICK_SETTINGS.padding / 2),
            y: key.y - KEY_SETTINGS.height - (BRICK_SETTINGS.padding / 2) + (BRICK_SETTINGS.height - KEY_SETTINGS.height),
            key: key.key
        }))
    }

    static generateKeyPositions(game: Game): BrickData[] {
        const { startPos, gap } = this.getConfig(game);
        const [xStartPos, yStartPos] = startPos;
        return this.keys.flatMap((keyRow, rowIndex) => 
            keyRow.join('').split('').map((key, colIndex) => ({
                x: xStartPos + (colIndex * (BRICK_SETTINGS.width + gap + BRICK_SETTINGS.padding)),
                y: yStartPos + (rowIndex * (BRICK_SETTINGS.height + gap + BRICK_SETTINGS.padding)),
                key
            })
        ));
    }

    private static calculateKeysInARow(): number {
        return this.keys[0].join('').split('').length;
    }

    private static calculateCanvasCenter(gap: number, canvasWidth: number): number {
        const numKeysInARow = this.calculateKeysInARow();
        const rowDistance = canvasWidth - (numKeysInARow - 1) * (BRICK_SETTINGS.width + gap);
        return rowDistance / 2;
    }

    private static levelOne(canvas: HTMLCanvasElement): BrickLevel {
        const gap = 10;
        const x = this.calculateCanvasCenter(gap, canvas.width);
        const y = canvas.height * 0.1;
        return {
            startPos: [x, y],
            gap
        };
    }

    private static levelTwo(canvas: HTMLCanvasElement): BrickLevel {
        const gap = 10;
        const x = this.calculateCanvasCenter(gap, canvas.width);
        const y = canvas.height * 0.1;
        return {
            startPos: [x, y],
            gap
        };
    }

    private static levelThree(canvas: HTMLCanvasElement): BrickLevel {
        const gap = 10;
        const x = this.calculateCanvasCenter(gap, canvas.width);
        const y = canvas.height * 0.1;
        return {
            startPos: [x, y],
            gap
        };
    }
}