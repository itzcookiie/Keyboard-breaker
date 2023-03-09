import { COLORS } from "./constants";

export enum GameLevel {
    ONE,
    TWO,
    THREE
};

interface Entity {
    draw(): void;
}

class Game {
    entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    level: GameLevel;

    constructor() {
        this.entities = [];
        this.level = GameLevel.ONE;
        this.drawCanvas();
    }

    drawCanvas() {
        if (!this.context) return;
        this.context.strokeStyle = COLORS.AQUA;
        this.context.lineWidth = 10;
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // TEST TO SEE IF THIS WORKS PROPERLY
    draw() {
        this.entities.forEach(entityObj => entityObj.draw());
    }

    registerEntity(entity: Entity) {
        this.entities.push(entity);
    }
}


export default Game;