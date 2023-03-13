import Bricks from './entities/bricks';
import Board from './entities/board';
import Ball from './entities/ball';

export enum GameLevel {
    ONE,
    TWO,
    THREE
};


type Entity = Bricks | Board | Ball;
type EntityClass<T> = new (game: Game) => T;

const STEP = 10;


class Game {
    private entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    level: GameLevel;
    timestamp: number;
    entityNames = [Bricks.name, Board.name, Ball.name];

    constructor() {
        this.timestamp = 0;
        this.entities = [];
        this.level = GameLevel.ONE;
    }

    getEntity(entityClass: EntityClass<Entity>): Entity | undefined {
        return this.entities.find(entity => entity instanceof entityClass);
    }

    // TEST TO SEE IF THIS WORKS PROPERLY
    draw() {
        if (!this.context) return;
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach(entityObj => entityObj.draw());
    }

    registerEntity(entity: EntityClass<Entity>) {
        this.entities.push(new entity(this));
    }

    registerEntities(...args: EntityClass<Entity>[]) {
        args.forEach(entity => this.registerEntity(entity));
    }

    runGameLoop(timestamp: number = 0) {
        // if(timestamp - this.timestamp >= STEP) {
        //     this.timestamp = timestamp;
        // }
        requestAnimationFrame(this.runGameLoop.bind(this));
        this.draw();
    }
}


export default Game;