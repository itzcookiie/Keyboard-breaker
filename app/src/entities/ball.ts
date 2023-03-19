import Game from "../game";
import Board from "./board";
import Bricks, { Brick } from "./bricks";

import BallConfig from "../configs/ballConfig";
import { State } from "../state";

import { BALL_SETTINGS, BOARD_SETTINGS, BRICK_SETTINGS, GAME_SETTINGS } from "../constants";
import { BorderCordsSide, Vector, BallLevel, SoundAlias } from '../types';
import { calculateBallDirection, calculateMouseDirection } from "../lib";


class Ball {
    data: BallLevel;
    game: Game;
    direction: Vector;
    reset: () => void;

    constructor(game: Game) {
        this.game = game;
        this.data = this.getData();
        this.direction = {
            x: 1, // towards right
            y: -1 // towards up
        };
        this.attachEventListener();
        this.reset = this.resetData;
    }

    drawBall() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = BALL_SETTINGS.color;
        ctx.arc(this.data.x, this.data.y, BALL_SETTINGS.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    draw() {
        this.drawBall();
        if(this.game.state === State.BALL_HOLD) {
            this.reset();
        } else if(this.game.state === State.GAMEPLAY) {
            this.moveBall();
        } else if(this.game.state === State.NEXT_LEVEL) {
            this.resetData();
        } else {

        }
    }

    detectCollision() {
        this.detectGroundCollision();
        this.detectWallCollision();
        this.detectBoardCollision();
        this.detectBrickCollision();
    }

    detectWallCollision() {
        if(this.data.x <= BALL_SETTINGS.radius || this.data.x >= this.game.canvas.width - BALL_SETTINGS.radius) {
            this.direction.x *= -1;
            this.game.soundManager.playSound(SoundAlias.WALL_HIT);
        }

        if(this.data.y <= BALL_SETTINGS.radius) {
            this.direction.y *= -1;
            this.game.soundManager.playSound(SoundAlias.WALL_HIT);
        }
    }

    detectGroundCollision() {
        if(this.data.y >= this.game.canvas.height) {
            console.log('Ball went out of play!');
            this.direction.y *= -1;
            this.game.soundManager.playSound(SoundAlias.GROUND_HIT);
            this.game.canvas.dispatchEvent(new CustomEvent('STATE:OUT_OF_PLAY'));
        }
    }

    detectBoardCollision() {
        const board = this.game.getEntity(Board);
        if(!(board instanceof Board)) return;
        const collision = board.getBorderCordsData().cords.find(cords => this.isColliding(cords));
        if(!collision) return;
        // Rewrite logic below
        // Trying to make it so when we hit corner ball reflects at like a 160 degree angle
        // Idea is if you hit board in center reflect at 90 degrees (straight up)
        // If you hit it at the corners it reflects by like 160 degrees
        // So the further from the center, the larger the angle/the more bent the ball reflects (key idea)


        const directionPoint = calculateBallDirection(board, collision.x, this.direction, BOARD_SETTINGS);
        if(!directionPoint) return;
        // this.direction.x = directionPoint.x;
        // if(this.direction.y > 0) {
        //     this.direction.y = -directionPoint.y;
        // } else {
        //     this.direction.y = directionPoint.y;
        // }
        this.direction = directionPoint;

        // const boardMidPoint = board.data.x + (BOARD_SETTINGS.width / 2);
        // const distanceFromCenter = collision.x - boardMidPoint;
        // const halfBoardWidth = BOARD_SETTINGS.width / 2;
        // const ratio = distanceFromCenter / halfBoardWidth;
        // this.direction.x = roundNumTo2DP(ratio);
        // // this.data.x = collision.x - BALL_SETTINGS.radius;

        // const yCornerComponent = 0.444; // 20 degrees. 45 degrees = 1. 20 degrees = (1 / 45) * 20
        // if(distanceFromCenter > 0) {
        //     const yRatio = 1 - roundNumTo2DP((1 - yCornerComponent) * (ratio));
        //     this.direction.y = -yRatio;
        // } else if(distanceFromCenter < 0) {
        //     const yRatio = -1 + roundNumTo2DP((-1 + yCornerComponent) * (ratio));
        //     this.direction.y = yRatio;
        // } else {
        //     this.direction.y = 1;
        // }
        // this.data.y = collision.y - BALL_SETTINGS.radius;

    }

    detectBrickCollision() {
        const bricks = this.game.getEntity(Bricks);
        if(!(bricks instanceof Bricks)) return;
        const collidedBrick = bricks.getBricksBorderCordsData().find(brickBorderCordData => 
            brickBorderCordData.cords.some(cord => this.isColliding({x: cord.x, y: cord.y}))
        );
        if(collidedBrick) {
            console.log('Ball and brick collision!');
            // const collisionPoints = collidedBrick.cords.filter(cord => this.isColliding({x: cord.x, y: cord.y}));
            // const collisionSides = collisionPoints.map(collisionPoint => collisionPoint.side);
            // if(!collisionSides.length) return;
            // if(collisionSides.includes(BorderCordsSide.LEFT) && collisionSides.includes(BorderCordsSide.TOP)) {
            //     this.direction.y *= -1;
            //     // this.data.x = board.data.x - BALL_SETTINGS.radius;
            // } else if(collisionSides.includes(BorderCordsSide.RIGHT) && collisionSides.includes(BorderCordsSide.TOP)) {
            //     this.direction.y *= -1;
            // } else if(collisionSides.includes(BorderCordsSide.RIGHT) || collisionSides.includes(BorderCordsSide.LEFT)) {
            //     this.direction.x *= -1;
            // }
            // else {
            //     this.direction.y *= -1;
            // }

            const collision = collidedBrick.cords.find(cord => this.isColliding({x: cord.x, y: cord.y}));
            if (!collision) return;
            console.log(collision)
            const directionPoint = calculateBallDirection(collidedBrick.entity, collision.x, this.direction, BRICK_SETTINGS);
            if(!directionPoint) return;
            console.log(directionPoint)
            // this.direction.x = directionPoint.x;
            // if(this.direction.y > 0) {
            //     this.direction.y = -directionPoint.y;
            // } else {
            //     this.direction.y = directionPoint.y;
            // };
            this.direction = directionPoint;

            // const collision = collidedBrick.cords.find(cord => this.isColliding({x: cord.x, y: cord.y}));
            // if (!collision) return;
            // if(collision.side === BorderCordsSide.LEFT || collision.side === BorderCordsSide.RIGHT) {
            //     this.direction.x *= -1;
            //     // this.data.x = board.data.x - BALL_SETTINGS.radius;
            // } else if(collision.side === BorderCordsSide.LEFT_CORNER) {
            //     this.direction.y *= -1;
            // } else if(collision.side === BorderCordsSide.RIGHT_CORNER) {
            //     this.direction.y *= -1;
            // }
            // else {
            //     this.direction.y *= -1;
            // }
            this.game.score += GAME_SETTINGS.pointsPerBrick;
            this.game.soundManager.playSound(SoundAlias.BRICK_HIT);
            bricks.destroyBrick(collidedBrick.entity);
        }
    }

    getData(): BallLevel {
        return BallConfig.getPositions(this.game);
    }

    resetData() {
        this.data = this.getData();
    }

    moveBall() {
        this.data.x += (this.data.xVelocity * this.direction.x);
        this.data.y += (this.data.yVelocity * this.direction.y);
        this.detectCollision();
    }

    releaseBall(e: MouseEvent) {
        // if(this.game.state !== State.BALL_HOLD) return;
        const directionPoint = calculateMouseDirection(this.game, e.offsetX, BOARD_SETTINGS);
        if(!directionPoint) return;
        this.direction.x = directionPoint.x;
        this.direction.y = -directionPoint.y;
        this.game.canvas.dispatchEvent(new CustomEvent('STATE:GAMEPLAY'));
    }

    attachEventListener() {
        // this.game.canvas.addEventListener('mousemove', (e) => {
        //     this.detectCollision();
        //     this.data.x = (e.offsetX / this.game.canvas.offsetWidth) * (this.game.canvas.width - BALL_SETTINGS.radius);
        //     this.data.y = (e.offsetY / this.game.canvas.offsetHeight) * (this.game.canvas.height - BALL_SETTINGS.radius);
        // })
        this.game.canvas.addEventListener('click', this.releaseBall.bind(this));
    }

    private isColliding(cords: Vector): boolean {
        const xDistance = Math.abs(cords.x - this.data.x);
        const yDistance = Math.abs(cords.y - this.data.y);
        const distance = Math.sqrt(yDistance**2 + xDistance**2);
        return distance < BALL_SETTINGS.radius; 
    }
}


export default Ball;