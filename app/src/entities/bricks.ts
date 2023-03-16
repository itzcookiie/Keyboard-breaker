import Game from '../game';

import { BricksConfig } from '../configs/bricksConfig';

import { BRICK_SETTINGS, KEY_SETTINGS } from '../constants';
import { BorderCordsData, BrickData } from '../types';
import { getAllBorderCords } from '../lib';
import { State } from '../state';


export class Brick {
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
    keys: BrickData[]

    constructor(game: Game) {
        this.game = game;
        this.data = this.generateBricks(game);
        this.keys = BricksConfig.generateKeyPositions(this.game);
    }

    destroyBrick(brick: Brick): boolean {
        const filteredData = this.data.filter(arrBrick => !arrBrick.matchCords(brick.data.x, brick.data.y));
        const success = filteredData.length < this.data.length;
        if(!success) return false;
        const destroyedKey = this.destroyKey(brick);
        if(!destroyedKey) return false;
        this.data = filteredData;
        return true;
    }

    destroyKey(brick: Brick): boolean {
        const filteredData = this.keys.filter(key => brick.data.key !== key.key);
        const success = filteredData.length < this.data.length;
        if(!success) return false;
        this.keys = filteredData;
        return true;
    }

    draw() {
        this.drawBricks();
        this.drawKeys();
        if(this.game.state === State.BALL_HOLD) {
            
        } else if(this.game.state === State.GAMEPLAY) {
            
        } else if(this.game.state === State.OUT_OF_PLAY) {
            
        } else if(this.game.state === State.NEXT_LEVEL) {
            this.resetData();
        } else {

        }
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
        this.keys.forEach(key => {
            ctx.fillText(key.key, key.x, key.y)
        });
        ctx.restore();
    }

    getBricksBorderCordsData(): BorderCordsData<Brick>[] {
        return this.data.flatMap(brick => getAllBorderCords<Brick>({
            entity: brick,
            data: {
                x: brick.data.x,
                y: brick.data.y,
                width: BRICK_SETTINGS.width,
                height: BRICK_SETTINGS.height
            }
        }))
    }
    

    getBrick(x: number, y: number): Brick | null {
        const results = this.data.filter(brick => brick.matchCords(x, y));
        return results.length ? results[0] : null;
    }

    resetData() {
        this.data = this.generateBricks(this.game);
        this.keys = BricksConfig.generateKeyPositions(this.game);
    }

    private generateBricks(game: Game): Brick[] {
        const bricksData = BricksConfig.generateBrickPositions(game);
        return bricksData.map(brickData => new Brick({ ...brickData }));
    }
}


export default Bricks;