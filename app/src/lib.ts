import { BOARD_SETTINGS } from './constants';
import { Board, Bricks } from './entities';
import Game from './game';
import { State } from './state';
import { BorderCords, BorderCordsData, BorderCordsSide, Entity, LoadedImage, Settings, SingleEntity, Vector } from './types';


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
        side: BorderCordsSide.TOP
    }));
}

export function getBottomBorderCords({ x, y, width, height }: BorderCordsPropsData): BorderCords[] {
    return Array.from({ length: width }, (_, i) => ({
        x: x + i,
        y: y + height,
        side: BorderCordsSide.BOTTOM
    }));
}

export function getRightBorderCords({ x, y, width, height }: BorderCordsPropsData): BorderCords[] {
    return Array.from({ length: height }, (_, i) => ({
        x: x + width,
        y: y + i,
        side: BorderCordsSide.RIGHT
    }));
}

export function getLeftBorderCords({ x, y, height }: BorderCordsPropsData): BorderCords[] {
    return Array.from({ length: height }, (_, i) => ({
        x: x,
        y: y + i,
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

export const loadImages = (images: Pick<LoadedImage, 'name' | 'path'>[], baseUrl: string): Promise<LoadedImage[]> => {
    return Promise.all(images.map(imageData => {
        return new Promise<LoadedImage>((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', function (e) {
                resolve({ ...imageData, element: this })
            });
            image.src = `${baseUrl}${imageData.path}`;
        });
    }))
};

export const roundNumTo2DP = (num: number): number => {
    return Math.round(num * 100 + Number.EPSILON) / 100;
}

export const calculateDirection = (entity: SingleEntity, xCord: number, settings: Settings): Vector | undefined => {
    const halfEntityWidth = settings.width / 2;
    const boardMidPoint = entity.data.x + halfEntityWidth;
    const distanceFromCenter = xCord - boardMidPoint;
    const ratio = distanceFromCenter / halfEntityWidth;
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
    const yRatio = 1 - roundNumTo2DP((1 - yCornerComponent) * (Math.abs(calcRatio)));
    direction.y = yRatio;

    return direction;
}

export const calculateXAndYDirection = (entity: SingleEntity, xCord: number, currDirection: Vector, settings: Settings): Vector | undefined => {
    const halfEntityWidth = settings.width / 2;
    const boardMidPoint = entity.data.x + halfEntityWidth;
    const distanceFromCenter = xCord - boardMidPoint;
    const ratio = distanceFromCenter / halfEntityWidth;
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
    const yRatio = 1 - roundNumTo2DP((1 - yCornerComponent) * (Math.abs(calcRatio)));
    direction.y = yRatio;

    if(currDirection.y > 0) {
        direction.y *= -1;
    }

    return direction;
}

export const calculateMouseDirection = (game: Game, xCord: number, settings: Settings): Vector | undefined => {
    if(game.state !== State.BALL_HOLD) return;
    const board = game.getEntity(Board);
    if (!(board instanceof Board)) return;

    const calcMouseX = (xCord / game.canvas.offsetWidth) * (game.canvas.width - BOARD_SETTINGS.width);
    const halfBoardWidth = BOARD_SETTINGS.width / 2;
    const calcBoardStartX = calcMouseX + halfBoardWidth;

    return calculateDirection(board, calcBoardStartX, settings);
}

export const calculateBallDirection = (entity: SingleEntity, xCord: number, direction: Vector, settings: Settings): Vector | undefined => {
    return calculateXAndYDirection(entity, xCord, direction, settings);
}