import Game from "../game";

import UIConfig from "../configs/uiConfig";

import { SCORE_SETTINGS } from "../constants";
import { State } from "../state";
import { LoadedImage, UIElementData, UIElementType } from "../types";


const IMAGES = [
    {'name': 'heart', path: '/heart.png'}
];


class CanvasUI {
    game: Game;
    data: UIElementData[];
    images: LoadedImage[];

    constructor(game: Game) {
        this.game = game;
        this.data = UIConfig.generatePositions(game);
        this.images = this.game.images;
    }

    drawText(uiElementData: UIElementData) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        uiElementData.cords.forEach(cord => {
            ctx.save();
            ctx.fillStyle = SCORE_SETTINGS.color;
            ctx.font = "40px Arial";
            // ctx.textAlign = 'center';
            ctx.fillText(this.game.score.toString(), cord.x, cord.y);
            ctx.restore();
        });
    }

    drawImages(uiElementData: UIElementData) {
        if (!this.game.context) return;
        const ctx = this.game.context;
        this.images.forEach(image => {
            uiElementData.cords.forEach(cord => {
                ctx.save();
                ctx.drawImage(image.element, cord.x, cord.y);
                ctx.restore();
            });
        })

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
            
        } else if(this.game.state === State.OUT_OF_PLAY) {
            this.data.forEach(uiElementData => {
                if(uiElementData.type === UIElementType.IMAGE) {
                    uiElementData.cords.pop();
                };
            });
        } else if(this.game.state === State.GAMEPLAY) {

        } else if(this.game.state === State.NEXT_LEVEL) {
            // this.data = this.getImagePositions();
        } else {

        }
    }

    reset() {
        this.data = UIConfig.generatePositions(this.game);
    }
}

export default CanvasUI;