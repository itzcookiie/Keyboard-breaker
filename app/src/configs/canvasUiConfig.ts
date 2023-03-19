import Game from "../game";

import { BALL_SETTINGS, GAME_SETTINGS, SCORE_SETTINGS } from "../constants";
import { UIElement, UIElementData, UIElementType } from "../types";
import { Ball } from "../entities";
import BallConfig from "./ballConfig";


const HEART_IMAGE_SETTINGS = {
    gap: 20,
    xOffset: 50,
    y: 50
};

class CanvasUIConfig {
    static generateHeartIconPositions(canvas: HTMLCanvasElement): UIElementData {
        return {
            name: UIElement.HEART_ICON,
            cords: Array.from({ length: GAME_SETTINGS.lives }, (_, i) => ({
                x: canvas.width - HEART_IMAGE_SETTINGS.xOffset - (i * HEART_IMAGE_SETTINGS.gap),
                y: HEART_IMAGE_SETTINGS.y,
            })),
            type: UIElementType.IMAGE,
            draw: true
        };
    }

    static generateScorePositions(): UIElementData {
        return {
            name: UIElement.SCORE,
            cords: Array.from({ length: 1 }, (_, i) => ({
                x: SCORE_SETTINGS.xOffset,
                y: SCORE_SETTINGS.y
            })),
            type: UIElementType.TEXT,
            draw: true
        };
    }

    static generateArrowPositions(game: Game): UIElementData {
        const ball = game.getEntity(Ball);
        if(ball instanceof Ball) {
            const x = ball.data.x;
            const y = ball.data.y;
            return {
                name: UIElement.ARROW,
                cords: Array.from({ length: 1 }, (_, i) => ({
                    x,
                    y
                })),
                type: UIElementType.TEXT,
                draw: true
            };
        } else {
            const {x: ballX, y: ballY} = BallConfig.getPositions(game);
            const x = ballX;
            const y = ballY;
            return {
                name: UIElement.ARROW,
                cords: Array.from({ length: 1 }, (_, i) => ({
                    x,
                    y
                })),
                type: UIElementType.TEXT,
                draw: true
            };
        };
    }

    static generatePositions(game: Game): UIElementData[] {
        return [
            this.generateScorePositions(),
            this.generateHeartIconPositions(game.canvas),
            this.generateArrowPositions(game),
        ];
    }
}

export default CanvasUIConfig;