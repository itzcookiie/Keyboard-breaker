import Game, { GameLevel } from '../game';
import { BRICK_SETTINGS, KEY_SETTINGS } from '../constants';
import { BricksConfig, BrickData } from '../configs/bricksConfig';


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

    constructor(game: Game) {
        this.game = game;
        this.data = this.generateBricks(game);
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

    draw() {
        this.drawBricks();
        this.drawKeys();
    }

    drawBricks() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.fillStyle = BRICK_SETTINGS.color;
        this.data.forEach(brick => {
            ctx.fillRect(brick.data.x, brick.data.y, KEY_SETTINGS.width + BRICK_SETTINGS.padding, KEY_SETTINGS.height + BRICK_SETTINGS.padding);
        });
        ctx.restore();
    }

    drawKeys() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.fillStyle = KEY_SETTINGS.color;
        ctx.font = "40px Arial";
        ctx.textAlign = 'center';
        BricksConfig.generateKeyPositions(this.game).forEach(key => {
            ctx.fillText(key.key, key.x, key.y)
        });
        ctx.restore();
    }
    

    getBrick(x: number, y: number): Brick | null {
        const results = this.data.filter(brick => brick.matchCords(x, y));
        return results.length ? results[0] : null;
    }

    updateBricks(game: Game) {
        this.data = this.generateBricks(game);
    }

    private generateBricks(game: Game): Brick[] {
        const bricksData = BricksConfig.generateBrickPositions(game);
        return bricksData.map(brickData => new Brick({ ...brickData }));
    }
}


export default Bricks;