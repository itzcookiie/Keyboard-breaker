import Bricks from './entities/bricks';
import { Entity, EntityClass, GameLevel, LoadedImage } from './types';
import { State } from './state';
import { GAME_SETTINGS } from './constants';


class Game {
    private entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    state: State;
    level: GameLevel;
    lives: number;
    images: LoadedImage[];
    timestamp: number;

    constructor(images: LoadedImage[]) {
        this.lives = GAME_SETTINGS.lives;
        this.timestamp = 0;
        this.entities = [];
        this.level = GameLevel.ONE;
        this.state = State.BALL_HOLD;
        this.images = images;
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
            this.state = State.BALL_HOLD;
        } else if(this.state === State.BALL_HOLD) {
            // this.state = State.GAMEPLAY;
        } else if(this.state === State.NEXT_LEVEL) {
            const newLevel = this.level + 1;
            if(newLevel > GameLevel.THREE) {
                this.state = State.GAME_OVER;
                return;
            }
            const levelString = GameLevel[newLevel];
            this.level = GameLevel[levelString as keyof typeof GameLevel];
            if(this.level === GameLevel.TWO) {
                ctx.save();
                ctx.translate(this.canvas.width, this.canvas.height);
                ctx.rotate(Math.PI);
            } else if(this.level === GameLevel.THREE) {
                ctx.restore();
            }
            this.state = State.GAMEPLAY;
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

    stateChangeAfterBallHitsGround() {
        this.state = State.OUT_OF_PLAY;
    }


    stateChangeAfterReleaseBall() {
        this.state = State.GAMEPLAY;
    }

    runGameLoop(timestamp: number = 0) {
        // if(timestamp - this.timestamp >= STEP) {
        //     this.timestamp = timestamp;
        // }
        requestAnimationFrame(this.runGameLoop.bind(this));
        if(this.isGameOver()) {
            this.state = State.NEXT_LEVEL;
        }
        this.draw();
    }

    attachEventListener() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
}


export default Game;