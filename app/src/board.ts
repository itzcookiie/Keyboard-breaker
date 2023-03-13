import Game from './game';
import { BOARD_SETTINGS } from './configs/boardConfig';
import { COLORS } from './constants';


interface BoardData {
    x: number;
    y: number;
}

class Board {
    data: BoardData;
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.data = this.calculateStartPosition();
        this.attachEventListener();
    }

    calculateStartPosition(): BoardData {
        return {
            x: (this.game.canvas.width - BOARD_SETTINGS.width) / 2,
            y: this.game.canvas.height * 0.8
        }
    }

    draw() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.fillStyle = COLORS.ORANGE;
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
        // console.log(canvasFarX)
        // console.log('Offset: ', e.offsetX)
        // console.log('Client: ', e.clientX)
        // console.log('Client X: ', x)
        // if(x <= canvasNearX || x >= canvasFarX) return;
        // console.log('Board x: ', this.data.x)
        const calculatedX = (e.offsetX / canvasLength) * (this.game.canvas.width - BOARD_SETTINGS.width);
        console.log(calculatedX)
        // if(calculatedX <= this.game.canvas.width - BOARD_SETTINGS.width) this.data.x = calculatedX;
        this.data.x = (e.offsetX / canvasLength) * (this.game.canvas.width - BOARD_SETTINGS.width);
    }

    reset() {
        this.data = this.calculateStartPosition();
    }

    attachEventListener() {
        this.game.canvas.addEventListener('mousemove', (e: MouseEvent) => this.moveBoard(e));
    }
}

export default Board;