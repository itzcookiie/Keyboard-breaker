import Game, { GameLevel } from './game';
import { BricksLevelConfig, BRICK_SETTINGS } from './configs/bricksConfig';


interface BrickData {
    x: number;
    y: number;
    key: string;
}

type BricksData = BrickData[];

class Brick {
    data: BrickData;

    constructor(data: BrickData) {
        this.data = data;
    }

    matchCords(x: number, y: number): boolean {
        return x === this.data.x && y === this.data.y;
    }
}


class Bricks {
    game: Game;
    data: Brick[];
    bricksConfig: BricksLevelConfig;

    constructor(game: Game) {
        this.game = game;
        this.bricksConfig = new BricksLevelConfig();
        this.data = this.generateBricks(game.level);
    }

    destroyBrick(brick: Brick): boolean {
        const filteredData = this.data.filter(arrBrick => !arrBrick.matchCords(brick.data.x, brick.data.y));
        const success = filteredData.length < this.data.length;
        if (success) {
            this.data = filteredData;
            return true;
        } else {
            return false;
        }
    }

    // TEST TO SEE IF THIS WORKS PROPERLY
    draw() {
        this.data.forEach(brick => {
            if(!this.game.context) return;
            this.game.context.fillRect(brick.data.x, brick.data.y, BRICK_SETTINGS.width, BRICK_SETTINGS.height);
        });
    }
    

    getBrick(x: number, y: number): Brick | null {
        const results = this.data.filter(brick => brick.matchCords(x, y));
        return results.length ? results[0] : null;
    }

    updateBricks(level: GameLevel) {
        this.data = this.generateBricks(level);
    }

    private generateBricks(level: GameLevel) {
        const bricksData = this.bricksConfig.generateBrickPositions(level);
        return bricksData.map(brickData => new Brick({ ...brickData }));
    }
}


export default Bricks;