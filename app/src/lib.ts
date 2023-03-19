import { BOARD_SETTINGS } from './constants';
import { Board } from './entities';
import Game from './game';
import { State } from './state';
import { BorderCords, BorderCordsData, BorderCordsSide, LoadedImage, Vector } from './types';


interface BorderCordsPropsData {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BorderCordsProps<BorderCordsPropsEntity> {
    entity: BorderCordsPropsEntity;
    data: BorderCordsPropsData;
}


export function getTopBorderCords({ x, y, width }: BorderCordsPropsData): BorderCords[] {
    return Array.from({ length: width }, (_, i) => ({
        x: x + i,
        y: y,
        side: i === 0 
            ? BorderCordsSide.LEFT_CORNER 
            : i === width - 1 
                ? BorderCordsSide.RIGHT_CORNER 
                : BorderCordsSide.TOP
    }));
}

export function getBottomBorderCords({ x, y, width, height }: BorderCordsPropsData): BorderCords[] {
    // Don't add original first and last position as those are picked up by the left and right functions 
    return Array.from({ length: width - 2 }, (_, i) => ({
        x: x + i + 1,
        y: y + height,
        side: i === 0 
            ? BorderCordsSide.LEFT_CORNER 
            : i === width - 1 
                ? BorderCordsSide.RIGHT_CORNER 
                : BorderCordsSide.TOP
    }));
}

export function getRightBorderCords({ x, y, width, height }: BorderCordsPropsData): BorderCords[] {
    // Skip the right first cord since it's already generated in the top
    return Array.from({ length: height - 1 }, (_, i) => ({
        x: x + width,
        y: y + i + 1,
        side: BorderCordsSide.RIGHT
    }));
}

export function getLeftBorderCords({ x, y, height }: BorderCordsPropsData): BorderCords[] {
    // Skip the right first cord since it's already generated in the top
    return Array.from({ length: height - 1 }, (_, i) => ({
        x: x,
        y: y + i + 1,
        side: BorderCordsSide.LEFT
    }));
}

export function getBorderCords<BorderCordsPropsEntity>({ entity, data }: BorderCordsProps<BorderCordsPropsEntity>): BorderCordsData<BorderCordsPropsEntity> {
    return {
        entity,
        cords: [
            ...getTopBorderCords(data),
            ...getLeftBorderCords(data),
            ...getRightBorderCords(data)
        ]
    }
}

export function getAllBorderCords<BorderCordsPropsEntity>({ entity, data }: BorderCordsProps<BorderCordsPropsEntity>): BorderCordsData<BorderCordsPropsEntity> {
    return {
        entity,
        cords: [
            ...getTopBorderCords(data),
            ...getLeftBorderCords(data),
            ...getRightBorderCords(data),
            ...getBottomBorderCords(data)
        ]
    }
}

export const loadImages = (images: Pick<LoadedImage, 'name' | 'path'>[]): Promise<LoadedImage[]> => {
    return Promise.all(images.map(imageData => {
        return new Promise<LoadedImage>((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', function(e) {
                resolve({ ...imageData, element: this })
            });
            image.src = imageData.path;
        });
    }))
 };

 export const roundNumTo2DP = (num: number): number => {
    return Math.round( num * 100 + Number.EPSILON ) / 100;
 }

 export const calculateDirection = (game: Game, cords: Vector): Vector | undefined => {
    if(game.state !== State.BALL_HOLD) return;
    // console.log(this.direction)
    const board = game.getEntity(Board);
    if(!(board instanceof Board)) return;

    const calcMouseX = (cords.x / game.canvas.offsetWidth) * (game.canvas.width - BOARD_SETTINGS.width);
    const halfBoardWidth = BOARD_SETTINGS.width / 2;
    const calcBoardStartX = calcMouseX + halfBoardWidth;

    const boardMidPoint = board.data.x + halfBoardWidth;
    const distanceFromCenter = calcBoardStartX - boardMidPoint;
    const ratio = distanceFromCenter / halfBoardWidth;
    const calcRatio = ratio > 1
        ? 1 
        : ratio < -1
        ? -1
        : ratio
    // if(ratio > 1) {
    //     direction.x = 1;
    // } else if(ratio < 0) {
    //     direction.x = -1;
    // } else {
    //     direction.x = ratio;
    // }
    const direction: Vector = {
        x: 0,
        y: 0
    }
    direction.x = roundNumTo2DP(calcRatio);

    const yCornerComponent = 0.444; // 20 degrees. 45 degrees = 1. 20 degrees = (1 / 45) * 20
    if(distanceFromCenter > 0) {
        const yRatio = 1 - roundNumTo2DP((1 - yCornerComponent) * (calcRatio));
        direction.y = -yRatio;
    } else if(distanceFromCenter < 0) {
        const yRatio = -1 + roundNumTo2DP((-1 + yCornerComponent) * (calcRatio));
        direction.y = yRatio;
    } else {
        direction.y = 1;
    }

    return direction;
}