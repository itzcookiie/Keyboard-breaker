import BallConfig from "../configs/ballConfig";
import { BALL_SETTINGS } from "../constants";
import Game from "../game";
import { Vector } from "../types";
import Board from "./board";


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
        this.detectCollisionGround();
        this.detectCollisionWall();
        this.detectCollisionBoard();
    }

    detectCollisionWall() {
        if(this.data.x >= this.game.canvas.width || this.data.x <= 0) this.direction.x *= -1; 
        if(this.data.y <= 0) this.direction.y *= -1;
    }

    detectCollisionGround() {
        if(this.data.y >= this.game.canvas.height) {
            console.log('Ball went out of play!');
            this.direction.y *= -1;
        }
    }

    detectCollisionBoard() {
        const board = this.game.getEntity(Board);
        if(!(board instanceof Board)) return;
        const xDistance = board.data.x - this.data.x;
        console.log(board)
    }

    moveBall() {
        this.data.x += (BALL_SETTINGS.xVelocity * this.direction.x);
        this.data.y += (BALL_SETTINGS.yVelocity * this.direction.y);
        this.detectCollision();
    }
}


export default Ball;