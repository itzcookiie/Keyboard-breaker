import Game from "../game";

import UIConfig from "../configs/uiConfig";

import { BOARD_SETTINGS, SCORE_SETTINGS } from "../constants";
import { State } from "../state";
import { LoadedImage, UIElement, UIElementData, UIElementType, Vector } from "../types";
import { Ball, Board } from "../entities";
import { calculateDirection, roundNumTo2DP } from "../lib";


class CanvasUI {
    game: Game;
    data: UIElementData[];
    images: LoadedImage[];
    direction: Vector;

    constructor(game: Game) {
        this.game = game;
        this.data = UIConfig.generatePositions(game);
        this.images = this.game.images;
        this.direction = {
            x: 0,
            y: 0
        }
        this.attachEventListeners();
    }

    draw() {
        this.data.forEach(uiElementData => {
            if(uiElementData.type === UIElementType.IMAGE) {
                this.drawImages(uiElementData);
            } else {
                this.drawText(uiElementData);
            }
        })
        if(this.game.state === State.BALL_HOLD) {
            this.reset();
        } else if(this.game.state === State.OUT_OF_PLAY) {
            this.data.forEach(uiElementData => {
                if(uiElementData.name === UIElement.HEART_ICON) {
                    uiElementData.cords.pop();
                };
            });
        } else if(this.game.state === State.GAMEPLAY) {
            this.removeArrow();
        } else if(this.game.state === State.NEXT_LEVEL) {
            // this.data = this.getImagePositions();
        } else {

        }
    }

    drawText(uiElementData: UIElementData) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        uiElementData.cords.forEach(cord => {
            ctx.save();
            if(uiElementData.name === UIElement.ARROW) {
                this.drawArrow(uiElementData);
            } else {
                ctx.fillStyle = SCORE_SETTINGS.color;
                ctx.font = "40px Arial";
                // ctx.textAlign = 'center';
                ctx.fillText(this.game.score.toString(), cord.x, cord.y);
            }
            ctx.restore();
        });
    }

    drawImages(uiElementData: UIElementData) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        this.images.forEach(image => {
            if(image.name === uiElementData.name) {
                uiElementData.cords.forEach(cord => {
                    ctx.save();
                    ctx.drawImage(image.element, cord.x, cord.y);
                    ctx.restore();
                });
            }
        })
    }

    drawArrow(uiElementData: UIElementData) {
        // this.drawArrowMidPart(uiElementData);
        // this.drawArrowLeftPart(uiElementData);
        // this.drawArrowRightPart(uiElementData);
        const handleArrowDirectionFn = this.handleArrowDirection(uiElementData);
        if(!handleArrowDirectionFn) return;
        handleArrowDirectionFn(this.drawArrowMidPart.bind(this));
        handleArrowDirectionFn(this.drawArrowRightPart.bind(this));
        handleArrowDirectionFn(this.drawArrowLeftPart.bind(this));

    }
    handleArrowDirection(uiElementData: UIElementData): undefined | ((drawArrowPartFnc: (cord: Vector) => void) => void) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        const maxAngle = 70; // 70 degrees
        const angle = maxAngle * this.direction.x;
        const rotationAngle = (Math.PI / 180) * angle;

        return (drawArrowPartFnc: (cord: Vector) => void) => {
            uiElementData.cords.forEach(cord => {
                ctx.save();
                ctx.translate(cord.x, cord.y);
                ctx.rotate(rotationAngle);
                ctx.translate(-cord.x, -cord.y);
                drawArrowPartFnc(cord);
                ctx.restore();
            });
        }
    }

    drawArrowRightPart(cord: Vector) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        ctx.beginPath();
        ctx.moveTo(cord.x, cord.y - 50);
        ctx.lineTo(cord.x + 10, cord.y - 40);
        ctx.stroke();
        ctx.closePath();
    }

    drawArrowLeftPart(cord: Vector) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        ctx.beginPath();
        ctx.moveTo(cord.x, cord.y - 50);
        ctx.lineTo(cord.x - 10, cord.y - 40);
        ctx.stroke();
        ctx.closePath();
    }

    drawArrowMidPart(cord: Vector) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        ctx.beginPath();
        ctx.moveTo(cord.x, cord.y);
        ctx.lineTo(cord.x, cord.y - 50);
        ctx.stroke();
    }

    removeArrow() {
        this.data = this.data.filter(uiElementData => uiElementData.name !== UIElement.ARROW);
    }

    reset() {
        this.data = UIConfig.generatePositions(this.game);
    }

    attachEventListeners() {
        this.game.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const directionPoint = calculateDirection(this.game, {
                x: e.offsetX,
                y: e.offsetY
            });
            if(!directionPoint) return;
            this.direction = directionPoint;
        });
    }
}

export default CanvasUI;