import Game from '../game';
import { BOARD_SETTINGS } from '../constants';
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
        const canvasBoundingRect = this.game.canvas.getBoundingClientRect();
        const canvasNearX = canvasBoundingRect.left;
        const canvasFarX = canvasBoundingRect.right;
        const canvasLength = canvasFarX - canvasNearX;

        // If you move the mouse really fast past edge of canvas border left or right
        // The paddle won't move all the way to the  end. It will only get as far as it last recorded
        // Potential fixes:
        // 1. Use event listener on body and say if mouse is beyond canvas border set board to 0 or canvas width
        // 2. Use Pointer Lock API
        this.data.x = (x / canvasLength) * (this.game.canvas.width - BOARD_SETTINGS.width);
    }

    reset() {
        this.data = BoardConfig.generatePosition(this.game);
    }

    attachEventListener() {
        this.game.canvas.addEventListener('mousemove', (e: MouseEvent) => this.moveBoard(e));
    }
}

export default Board;