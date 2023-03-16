import { BorderCords, BorderCordsData, BorderCordsSide, LoadedImage } from './types';


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