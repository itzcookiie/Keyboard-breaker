import Game from "../game";

import { GAME_SETTINGS, SCORE_SETTINGS } from "../constants";
import { UIElement, UIElementData, UIElementType } from "../types";


const HEART_IMAGE_SETTINGS = {
    gap: 20,
    xOffset: 50,
    y: 50
};

class UIConfig {
    private static generateHeartIconPositions(canvas: HTMLCanvasElement): UIElementData {
        return {
            name: UIElement.HEART_ICONS,
            cords: Array.from({ length: GAME_SETTINGS.lives }, (_, i) => ({
                x: canvas.width - HEART_IMAGE_SETTINGS.xOffset - (i * HEART_IMAGE_SETTINGS.gap),
                y: HEART_IMAGE_SETTINGS.y,
            })),
            type: UIElementType.IMAGE
        };
    }

    private static generateScorePositions(): UIElementData {
        return {
            name: UIElement.SCORE,
            cords: Array.from({ length: 1 }, (_, i) => ({
                x: SCORE_SETTINGS.xOffset,
                y: SCORE_SETTINGS.y
            })),
            type: UIElementType.TEXT
        };
    }

    static generatePositions(game: Game): UIElementData[] {
        return [
            this.generateScorePositions(),
            this.generateHeartIconPositions(game.canvas),
        ];
    }
}

export default UIConfig;