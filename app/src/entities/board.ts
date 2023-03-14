import Game from '../game';
import { BOARD_SETTINGS } from '../constants';
import { BorderCords, BorderCordsSide } from '../types';
import BoardConfig from '../configs/boardConfig';
import { Vector } from '../types';


class Board {
    data: Vector;
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.data = BoardConfig.generatePosition(game);
        this.attachEventListener();
    }

    draw() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.fillStyle = BOARD_SETTINGS.color;
        ctx.fillRect(this.data.x, this.data.y, BOARD_SETTINGS.width, BOARD_SETTINGS.height);
        ctx.restore();
    }

    moveBoard(e: MouseEvent) {
        if(!this.game.canvas) return;
        const x = e.offsetX;
        const canvasLength = this.game.canvas.offsetWidth;

        // If you move the mouse really fast past edge of canvas border left or right
        // The paddle won't move all the way to the  end. It will only get as far as it last recorded
        // Potential fixes:
        // 1. Use event listener on body and say if mouse is beyond canvas border set board to 0 or canvas width
        // 2. Use Pointer Lock API
        this.data.x = (e.offsetX / this.game.canvas.offsetWidth) * (this.game.canvas.width - BOARD_SETTINGS.width);
    }

    getTopBorderCords(): BorderCords[] {
        return Array.from({ length: BOARD_SETTINGS.width }, (_, i) => ({
            x: this.data.x + i,
            y: this.data.y,
            side: i === 0 
                ? BorderCordsSide.LEFT_CORNER 
                : i === BOARD_SETTINGS.width - 1 
                    ? BorderCordsSide.RIGHT_CORNER 
                    : BorderCordsSide.TOP
        }));
    }

    getRightBorderCords(): BorderCords[] {
        // Skip the right first cord since it's already generated in the top
        return Array.from({ length: BOARD_SETTINGS.height - 1 }, (_, i) => ({
            x: this.data.x + BOARD_SETTINGS.width,
            y: this.data.y + i + 1,
            side: BorderCordsSide.RIGHT
        }));
    }

    getLeftBorderCords(): BorderCords[] {
        // Skip the right first cord since it's already generated in the top
        return Array.from({ length: BOARD_SETTINGS.height - 1 }, (_, i) => ({
            x: this.data.x,
            y: this.data.y + i + 1,
            side: BorderCordsSide.LEFT
        }));
    }

    getBorderCords() {
        return [
            ...this.getTopBorderCords(),
            ...this.getLeftBorderCords(),
            ...this.getRightBorderCords()
        ]
    }

    reset() {
        this.data = BoardConfig.generatePosition(this.game);
    }

    attachEventListener() {
        this.game.canvas.addEventListener('mousemove', (e: MouseEvent) => this.moveBoard(e));
        // this.game.canvas.addEventListener('click', (e) => console.log(this.data));
    }
}

export default Board;