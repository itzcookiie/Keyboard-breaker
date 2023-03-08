import { COLORS } from "./constants";

export enum GameLevel {
    ONE,
    TWO,
    THREE
};

class Game {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");

    constructor() {
        this.drawCanvas();
    }

    drawCanvas() {
        if (!this.context) return;
        this.context.strokeStyle = COLORS.AQUA;
        this.context.lineWidth = 10;
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


export default Game;