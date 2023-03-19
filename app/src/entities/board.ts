import Game from '../game';
import { BOARD_SETTINGS } from '../constants';
import { BorderCordsData } from '../types';
import BoardConfig from '../configs/boardConfig';
import { Vector } from '../types';
import { getBorderCords } from '../lib';
import { State } from '../state';


class Board {
    data: Vector;
    game: Game;
    reset: () => void;

    constructor(game: Game) {
        this.game = game;
        this.data = this.getData();
        this.attachEventListener();
        this.reset = this.resetData;
    }

    drawBoard() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.fillStyle = BOARD_SETTINGS.color;
        ctx.fillRect(this.data.x, this.data.y, BOARD_SETTINGS.width, BOARD_SETTINGS.height);
        ctx.restore();
    }

    draw() {
        this.drawBoard();
        if(this.game.state === State.BALL_HOLD) {
            // this.reset();
        } else if(this.game.state === State.GAMEPLAY) {
            
        } else if(this.game.state === State.OUT_OF_PLAY) {
            
        } else if(this.game.state === State.NEXT_LEVEL) {
            this.resetData();
        } else {

        }
    }

    moveBoard(e: MouseEvent) {
        if(!this.game.canvas || this.game.state !== State.GAMEPLAY) return;
        // If you move the mouse really fast past edge of canvas border left or right
        // The paddle won't move all the way to the  end. It will only get as far as it last recorded
        // Potential fixes:
        // 1. Use event listener on body and say if mouse is beyond canvas border set board to 0 or canvas width
        // 2. Use Pointer Lock API
        this.data.x = (e.offsetX / this.game.canvas.offsetWidth) * (this.game.canvas.width - BOARD_SETTINGS.width);
    }

    // getTopBorderCords(): BorderCords[] {
    //     return Array.from({ length: BOARD_SETTINGS.width }, (_, i) => ({
    //         x: this.data.x + i,
    //         y: this.data.y,
    //         side: i === 0 
    //             ? BorderCordsSide.LEFT_CORNER 
    //             : i === BOARD_SETTINGS.width - 1 
    //                 ? BorderCordsSide.RIGHT_CORNER 
    //                 : BorderCordsSide.TOP
    //     }));
    // }

    // getRightBorderCords(): BorderCords[] {
    //     // Skip the right first cord since it's already generated in the top
    //     return Array.from({ length: BOARD_SETTINGS.height - 1 }, (_, i) => ({
    //         x: this.data.x + BOARD_SETTINGS.width,
    //         y: this.data.y + i + 1,
    //         side: BorderCordsSide.RIGHT
    //     }));
    // }

    // getLeftBorderCords(): BorderCords[] {
    //     // Skip the right first cord since it's already generated in the top
    //     return Array.from({ length: BOARD_SETTINGS.height - 1 }, (_, i) => ({
    //         x: this.data.x,
    //         y: this.data.y + i + 1,
    //         side: BorderCordsSide.LEFT
    //     }));
    // }

    getBorderCordsData(): BorderCordsData<this> {
        return getBorderCords<this>({
            entity: this,
            data: {
                x: this.data.x,
                y: this.data.y,
                height: BOARD_SETTINGS.height,
                width: BOARD_SETTINGS.width
            }
        })
    }

    getData() {
        return BoardConfig.generatePosition(this.game);
    }

    resetData() {
        this.data = this.getData();
    }

    attachEventListener() {
        this.game.canvas.addEventListener('mousemove', this.moveBoard.bind(this));
        // this.game.canvas.addEventListener('click', (e) => console.log(this.data));
    }
}

export default Board;