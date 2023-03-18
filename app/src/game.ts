import Bricks from './entities/bricks';
import SoundManager from './view/soundManager';

import { Entity, EntityClass, GameLevel, LoadedImage } from './types';
import { State } from './state';
import { GAME_SETTINGS } from './constants';
import { SoundAlias } from "./types";
import CanvasUI from './view/canvasUi';
import HtmlUI from './view/htmlUi';


class Game {
    private readonly canvasUI: CanvasUI
    private readonly htmlUI: HtmlUI
    private entities: Entity[];
    readonly images: LoadedImage[];
    readonly soundManager: SoundManager;
    readonly canvas = document.getElementById('canvas') as HTMLCanvasElement;
    readonly context = this.canvas.getContext("2d");
    isGameOver = false;
    state: State;
    level: GameLevel;
    lives: number;
    score: number;
    timestamp: number;

    constructor(images: LoadedImage[]) {
        this.soundManager = new SoundManager();
        this.canvasUI = new CanvasUI(this);
        this.htmlUI = new HtmlUI(this);
        this.lives = GAME_SETTINGS.lives;
        this.timestamp = 0;
        this.score = 0;
        this.entities = [];
        this.level = GameLevel.ONE;
        this.state = State.BALL_HOLD;
        this.images = images;
        // Added to future work
        this.attachEventListener();
    }

    init() {
        this.soundManager.playSound(SoundAlias.BACKGROUND);
    }

    getEntity(entityClass: EntityClass<Entity>): Entity | undefined {
        return this.entities.find(entity => entity instanceof entityClass);
    }

    getEntities(...entityClasses: EntityClass<Entity>[]): Entity[] | undefined {
        return this.entities.filter(entity => entityClasses.some(entityClass => entity instanceof entityClass));
    }

    draw() {
        if (!this.context) return;
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach(entityObj => entityObj.draw());

        if(this.gameLevelFinished()) {
            this.state = State.NEXT_LEVEL;
        };

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
            this.onGameOver();
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

    onGameOver() {
        this.htmlUI.showGameOverPopUp();
    }

    reset() {
        this.score = 0;
        this.lives = GAME_SETTINGS.lives;
        this.level = GameLevel.ONE;
        this.state = State.BALL_HOLD;
        this.entities.forEach(entityObj => entityObj.reset());
        this.canvasUI.reset();
        this.isGameOver = false;
        this.startGame();
    }

    startGame() {
        this.draw();
        if(this.isGameOver) return;
        requestAnimationFrame(this.startGame.bind(this));
    }

    attachEventListener() {
        // window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.document.addEventListener('keydown', (e) => {
            if(e.code === 'KeyM') {
                this.soundManager.toggle();
            }
        });
    }
}


export default Game;