import { COLORS } from "./constants";

export enum GameLevel {
    ONE,
    TWO,
    THREE
};

interface Entity {
    draw(): void;
}

type EntityClass<T> = new (game: Game) => T;

const STEP = 10;


class Game {
    private entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    level: GameLevel;
    timestamp: number;

    constructor() {
        this.timestamp = 0;
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
        if (!this.context) return;
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach(entityObj => entityObj.draw());
    }

    registerEntity(entity: EntityClass<Entity>) {
        this.entities.push(new entity(this));
    }

    registerEntities(...args: EntityClass<Entity>[]) {
        args.forEach(entity => this.registerEntity(entity));
    }

    runGameLoop(timestamp: number = 0) {
        if(timestamp - this.timestamp >= STEP) {
            this.draw();
            this.timestamp = timestamp;
        }
        requestAnimationFrame(this.runGameLoop.bind(this));
    }
}


export default Game;