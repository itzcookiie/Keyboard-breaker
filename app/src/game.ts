import Bricks from './entities/bricks';
import { Entity, EntityClass, GameLevel, LoadedImage } from './types';
import { State } from './state';
import { GAME_SETTINGS } from './constants';


class Game {
    private entities: Entity[];
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = this.canvas.getContext("2d");
    isGameOver = false;
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
        this.state = State.NEXT_LEVEL;
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
            this.lives === 0 ? this.state = State.GAME_OVER : this.state = State.BALL_HOLD;
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
            this.state = State.BALL_HOLD;
        } else if(this.state === State.GAME_OVER) {
            console.log('Game over!');
            this.isGameOver = true;
            // Add game over logic here e.g. display game over instructions
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

    gameLevelFinished(): boolean {
        const bricks = this.getEntity(Bricks);
        if(!(bricks instanceof Bricks)) return false;
        return bricks.data.length === 0;
    }


    stateChangeAfterReleaseBall() {
        this.state = State.GAMEPLAY;
    }

    onBallHitsGround() {
        this.lives--;
        this.state = State.OUT_OF_PLAY;
    }

    runGameLoop(timestamp: number = 0) {
        // if(timestamp - this.timestamp >= STEP) {
        //     this.timestamp = timestamp;
        // }
        this.draw();
        if(this.isGameOver) return;
        if(this.gameLevelFinished()) {
            this.state = State.NEXT_LEVEL;
        }
        requestAnimationFrame(this.runGameLoop.bind(this));
    }

    attachEventListener() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
}


export default Game;