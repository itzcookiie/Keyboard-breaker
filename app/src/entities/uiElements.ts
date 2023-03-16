import { GAME_SETTINGS } from "../constants";
import Game from "../game";
import { State } from "../state";
import { LoadedImage, Vector } from "../types";


const HEART_IMAGE_SETTINGS = {
    gap: 20,
    xOffset: 50,
    y: 50
};


class UIElements {
    game: Game;
    data: Vector[];
    images: LoadedImage[];

    constructor(game: Game) {
        this.game = game;
        this.data = this.getImagePositions();
        this.images = this.game.images;
    }

    getImagePositions(): Vector[] {
        return Array.from({ length: GAME_SETTINGS.lives }, (_, i) => ({
            x: this.game.canvas.width - HEART_IMAGE_SETTINGS.xOffset - (i * HEART_IMAGE_SETTINGS.gap),
            y: HEART_IMAGE_SETTINGS.y
        }));
    }

    drawImages() {
        if (!this.game.context) return;
        const ctx = this.game.context;
        this.images.forEach(image => {
            if(image.name === 'heart') {
                this.data.forEach(imageCord => {
                    ctx.drawImage(image.element, imageCord.x, imageCord.y);
                });
            };
        });
    }

    draw() {
        this.drawImages();
        if(this.game.state === State.BALL_HOLD) {
            
        } else if(this.game.state === State.OUT_OF_PLAY) {
            this.data.pop();
        } else if(this.game.state === State.GAMEPLAY) {

        } else if(this.game.state === State.NEXT_LEVEL) {
            this.data = this.getImagePositions();
        } else {

        }
    }
}

export default UIElements;