import Bricks from './entities/bricks';
import SoundManager from './soundManager';

import { Entity, GenericClass, GameLevel, LoadedImage, UI } from './types';
import { State } from './state';
import { GAME_SETTINGS } from './constants';
import { SoundAlias } from "./types";
import CanvasUI from './view/canvasUi';
import HtmlUI from './view/htmlUi';


class Game {
    private uis: UI[];
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
        this.lives = GAME_SETTINGS.lives;
        this.timestamp = 0;
        this.score = 0;
        this.entities = [];
        this.uis = [];
        this.level = GameLevel.ONE;
        this.state = State.BALL_HOLD;
        this.images = images;
        // Added to future work
        this.attachEventListener();
    }

    init() {
        this.soundManager.playSound(SoundAlias.BACKGROUND);
    }

    getEntity(entityClass: GenericClass<Entity>): Entity | undefined {
        return this.entities.find(entity => entity instanceof entityClass);
    }

    getEntities(...entityClasses: GenericClass<Entity>[]): Entity[] | undefined {
        return this.entities.filter(entity => entityClasses.some(entityClass => entity instanceof entityClass));
    }

    getUi(uiClass: GenericClass<UI>): UI | undefined {
        return this.uis.find(ui => ui instanceof uiClass);
    }

    getUis(...entityClasses: GenericClass<UI>[]): UI[] | undefined {
        return this.uis.filter(ui => entityClasses.some(uiClass => ui instanceof uiClass));
    }

    draw() {
        if (!this.context) return;
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach(entityObj => entityObj.draw());
        this.uis.forEach(ui => {
            if(ui instanceof CanvasUI) ui.draw();
        });
        this.handleState();
    }

    handleState() {
        if (!this.context) return;
        const ctx = this.context;
        if(this.state === State.GAMEPLAY) {
            if(this.gameLevelFinished()) this.state = State.NEXT_LEVEL;
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

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        const aspectRatio = 1366 / 768;
        this.canvas.height = this.canvas.width / aspectRatio;
    }

    registerEntity(entity: GenericClass<Entity>) {
        this.entities.push(new entity(this));
    }

    registerUi(entity: GenericClass<UI>) {
        this.uis.push(new entity(this));
    }

    registerUis(...args: GenericClass<UI>[]) {
        args.forEach(ui => this.registerUi(ui));
    }

    registerEntities(...args: GenericClass<Entity>[]) {
        args.forEach(entity => this.registerEntity(entity));
    }

    gameLevelFinished(): boolean {
        const bricks = this.getEntity(Bricks);
        if(!(bricks instanceof Bricks)) return false;
        return bricks.data.length === 0;
    }

    addStateChangeEventListeners() {
        this.canvas.addEventListener('STATE:GAMEPLAY', this.stateChangeAfterReleaseBall.bind(this))
        this.canvas.addEventListener('STATE:OUT_OF_PLAY', this.onBallHitsGround.bind(this))
    }

    stateChangeAfterReleaseBall() {
        this.state = State.GAMEPLAY;
    }

    onBallHitsGround() {
        this.lives--;
        this.state = State.OUT_OF_PLAY;
    }

    onGameOver() {
        const htmlUI = this.getUi(HtmlUI);
        if(!(htmlUI instanceof HtmlUI)) return;
        htmlUI.showGameOverPopUp();
    }

    reset() {
        if (!this.context) return;
        const ctx = this.context;
        ctx.restore();
        this.score = 0;
        this.lives = GAME_SETTINGS.lives;
        this.level = GameLevel.ONE;
        this.state = State.BALL_HOLD;
        this.entities.forEach(entityObj => entityObj.reset());
        this.isGameOver = false;
        const canvasUI = this.getUi(CanvasUI);
        if(canvasUI instanceof CanvasUI) canvasUI.reset();
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
                this.soundManager.toggleMuteBackground();
            } else if(e.code === 'KeyA') {
                this.soundManager.toggle();
            }
        });
        this.addStateChangeEventListeners();
    }
}


export default Game;