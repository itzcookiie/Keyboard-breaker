import Bricks, { Brick } from './entities/bricks';
import Board from './entities/board';
import Ball from './entities/ball';
import { Entity, EntityClass, GameLevel } from './types';
import { State } from './state';


const STEP = 10;


class Game {
    private entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    state: State;
    level: GameLevel;
    timestamp: number;

    constructor() {
        this.timestamp = 0;
        this.entities = [];
        this.level = GameLevel.ONE;
        this.state = State.GAMEPLAY;
        // Added to future work
        // this.attachEventListener();
    }

    getEntity(entityClass: EntityClass<Entity>): Entity | undefined {
        return this.entities.find(entity => entity instanceof entityClass);
    }

    getEntities(...entityClasses: EntityClass<Entity>[]): Entity[] | undefined {
        return this.entities.filter(entity => entityClasses.some(entityClass => entity instanceof entityClass));
    }

    // TEST TO SEE IF THIS WORKS PROPERLY
    draw() {
        if (!this.context) return;
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach(entityObj => entityObj.draw());
        if(this.state === State.GAMEPLAY) {
            // this.entities.forEach(entityObj => entityObj.draw());
        } else if(this.state === State.OUT_OF_PLAY) {
            // const collisionEntities = this.getEntities(Ball, Board);
            // if(collisionEntities && collisionEntities.length > 1) {
            //     collisionEntities.forEach(entity => {
            //         if(entity instanceof Ball) {
            //             entity.reset();
            //         };
            //         if(entity instanceof Board) {
            //             entity.reset();
            //         };
            //     })

            // }
            this.state = State.BALL_HOLD;
        } else if(this.state === State.BALL_HOLD) {
            // this.state = State.GAMEPLAY;
        }
    }

    resizeCanvas(e: UIEvent) {
        this.canvas.width = this.canvas.offsetWidth;
        const aspectRatio = 1366 / 768;
        this.canvas.height = this.canvas.width / aspectRatio;
    }

    registerEntity(entity: EntityClass<Entity>) {
        this.entities.push(new entity(this));
    }

    registerEntities(...args: EntityClass<Entity>[]) {
        args.forEach(entity => this.registerEntity(entity));
    }

    isGameOver(): boolean {
        const bricks = this.getEntity(Bricks);
        if(!(bricks instanceof Bricks)) return false;
        return bricks.data.length === 0;
    }

    runGameLoop(timestamp: number = 0) {
        // if(timestamp - this.timestamp >= STEP) {
        //     this.timestamp = timestamp;
        // }
        requestAnimationFrame(this.runGameLoop.bind(this));
        if(this.isGameOver()) {
            this.state = State.BALL_HOLD
            console.log('Game over!');
        }
        this.draw();
    }

    attachEventListener() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
}


export default Game;