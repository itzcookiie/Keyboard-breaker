import BallConfig from "../configs/ballConfig";
import { BALL_SETTINGS, BOARD_SETTINGS } from "../constants";
import { BorderCordsSide } from '../types';
import Game from "../game";
import { Vector } from "../types";
import Board from "./board";
import Bricks, { Brick } from "./bricks";


class Ball {
    data: Vector;
    game: Game;
    direction: Vector;

    constructor(game: Game) {
        this.game = game;
        this.data = BallConfig.getPositions(game);
        this.direction = {
            x: 1, // +ve direction
            y: 1 // +ve direction
        }
        // this.attachEventListener();
    }

    draw() {
        if(!this.game.context) return;
        const ctx = this.game.context;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = BALL_SETTINGS.color;
        ctx.arc(this.data.x, this.data.y, BALL_SETTINGS.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        this.moveBall();
    }

    detectCollision() {
        this.detectGroundCollision();
        this.detectWallCollision();
        this.detectBoardCollision();
        this.detectBrickCollision();
    }

    detectWallCollision() {
        if(this.data.x <= BALL_SETTINGS.radius || this.data.x >= this.game.canvas.width - BALL_SETTINGS.radius) 
            this.direction.x *= -1;
        
        if(this.data.y <= BALL_SETTINGS.radius) this.direction.y *= -1;
    }

    detectGroundCollision() {
        if(this.data.y >= this.game.canvas.height) {
            console.log('Ball went out of play!');
            this.direction.y *= -1;
        }
    }

    detectBoardCollision() {
        const board = this.game.getEntity(Board);
        if(!(board instanceof Board)) return;
        const collision = board.getBorderCordsData().cords.find(cords => this.isColliding(cords));
        if(collision) {
            console.log('Ball and board collision!');
            console.log(collision)
            if(collision.side === BorderCordsSide.LEFT || collision.side === BorderCordsSide.RIGHT) {
                this.direction.x *= -1;
                // this.data.x = board.data.x - BALL_SETTINGS.radius;
            } else if(collision.side === BorderCordsSide.LEFT_CORNER) {
                this.direction.y *= -1;
                this.data.y = board.data.y - BALL_SETTINGS.radius;
            } else if(collision.side === BorderCordsSide.RIGHT_CORNER) {
                this.direction.y *= -1;
                this.data.y = board.data.y - BALL_SETTINGS.radius;
            }
            else {
                this.direction.y *= -1;
                this.data.y = board.data.y - BALL_SETTINGS.radius;
            }
            // Rewrite logic below
            // Trying to make it so when we hit corner ball reflects at like a 160 degree angle
            // Idea is if you hit board in center reflect at 90 degrees (straight up)
            // If you hit it at the corners it reflects by like 160 degrees
            // So the further from the center, the larger the angle/the more bent the ball reflects (key idea)
            
            // const boardMidPoint = board.data.x + (BOARD_SETTINGS.width / 2);
            // const distanceFromCenter = collision.x - boardMidPoint;
            // if(distanceFromCenter > 0) { // Collision happened on right side
            //     const borderCorner = board.data.x + BOARD_SETTINGS.width; // Right corner
            //     const halfBoardWidth = BOARD_SETTINGS.width / 2;
            //     const minAngle = 90 // Sin 90 (in degrees. Convert from radians = 1)
            //     const maxAngle = 160; // Sin 160 degrees
            //     const angleDiff = maxAngle - minAngle;
            //     const ratio = (distanceFromCenter / halfBoardWidth) * angleDiff;
            //     const radiansToDegree = Math.PI / 180;
            //     const angle = Math.sin(radiansToDegree * (minAngle + ratio));
            //     this.direction.y *= (angle * -1);
            // } else if(distanceFromCenter < 0) { // Left side

            // } else { // Center
            //     const angle = Math.sin(90);
            // }
        }
    }

    detectBrickCollision() {
        const bricks = this.game.getEntity(Bricks);
        if(!(bricks instanceof Bricks)) return;
        const collidedBrick = bricks.getBricksBorderCordsData().find(brickBorderCordData => 
            brickBorderCordData.cords.some(cord => this.isColliding({x: cord.x, y: cord.y}))
        );
        if(collidedBrick && collidedBrick.entity instanceof Brick) {
            console.log('Ball and brick collision!');
            const collision = collidedBrick.cords.find(cord => this.isColliding({x: cord.x, y: cord.y}));
            if (!collision) return;
            if(collision.side === BorderCordsSide.LEFT || collision.side === BorderCordsSide.RIGHT) {
                this.direction.x *= -1;
                // this.data.x = board.data.x - BALL_SETTINGS.radius;
            } else if(collision.side === BorderCordsSide.LEFT_CORNER) {
                this.direction.y *= -1;
            } else if(collision.side === BorderCordsSide.RIGHT_CORNER) {
                this.direction.y *= -1;
            }
            else {
                this.direction.y *= -1;
            }
            bricks.destroyBrick(collidedBrick.entity);
        }
    }

    private isColliding(cords: Vector): boolean {
        const xDistance = Math.abs(cords.x - this.data.x);
        const yDistance = Math.abs(cords.y - this.data.y);
        const distance = Math.sqrt(yDistance**2 + xDistance**2);
        return distance < BALL_SETTINGS.radius; 
    }

    moveBall() {
        this.data.x += (BALL_SETTINGS.xVelocity * this.direction.x);
        this.data.y += (BALL_SETTINGS.yVelocity * this.direction.y);
        this.detectCollision();
    }

    attachEventListener() {
        this.game.canvas.addEventListener('mousemove', (e) => {
            this.detectCollision();
            this.data.x = (e.offsetX / this.game.canvas.offsetWidth) * (this.game.canvas.width - BALL_SETTINGS.radius);
            this.data.y = (e.offsetY / this.game.canvas.offsetHeight) * (this.game.canvas.height - BALL_SETTINGS.radius);
        })
    }
}


export default Ball;