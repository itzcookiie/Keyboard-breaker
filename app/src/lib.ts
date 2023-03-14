import { BorderCords, BorderCordsData, BorderCordsSide } from './types';


interface BorderCordsData {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BorderCordsProps<BorderCordsEntity> {
    entity: BorderCordsEntity;
    data: BorderCordsData;
}


export function getTopBorderCords({ x, y, width }: BorderCordsData): BorderCords[] {
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

export function getBottomBorderCords({ x, y, width, height }: BorderCordsData): BorderCords[] {
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

export function getRightBorderCords({ x, y, width, height }: BorderCordsData): BorderCords[] {
    // Skip the right first cord since it's already generated in the top
    return Array.from({ length: height - 1 }, (_, i) => ({
        x: x + width,
        y: y + i + 1,
        side: BorderCordsSide.RIGHT
    }));
}

export function getLeftBorderCords({ x, y, height }: BorderCordsData): BorderCords[] {
    // Skip the right first cord since it's already generated in the top
    return Array.from({ length: height - 1 }, (_, i) => ({
        x: x,
        y: y + i + 1,
        side: BorderCordsSide.LEFT
    }));
}

export function getBorderCords<BorderCordsEntity>({ entity, data }: BorderCordsProps<BorderCordsEntity>): BorderCordsData<BorderCordsEntity> {
    return {
        entity,
        cords: [
            ...getTopBorderCords(data),
            ...getLeftBorderCords(data),
            ...getRightBorderCords(data)
        ]
    }
}

export function getAllBorderCords<BorderCordsEntity>({ entity, data }: BorderCordsProps<BorderCordsEntity>): BorderCordsData<BorderCordsEntity> {
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