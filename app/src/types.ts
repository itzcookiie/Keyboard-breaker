export interface Vector {
    x: number;
    y: number;
};

export enum BorderCordsSide {
    LEFT = 'LEFT',
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    LEFT_CORNER = 'LEFT_CORNER',
    RIGHT_CORNER = 'RIGHT_CORNER',
}

export interface BorderCords extends Vector {
    side: BorderCordsSide;
}

export interface BrickData {
    x: number;
    y: number;
    key: string;
}