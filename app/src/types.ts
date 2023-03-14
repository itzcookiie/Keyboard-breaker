import Ball from "./entities/ball";
import Board from "./entities/board";
import Bricks from "./entities/bricks";
import Game from "./game";


export type Entity = Bricks | Board | Ball;
export type EntityClass<T> = new (game: Game) => T;

export enum GameLevel {
    ONE,
    TWO,
    THREE
};

export interface Vector {
    x: number;
    y: number;
};

export enum BorderCordsSide {
    LEFT = 'LEFT',
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT_CORNER = 'LEFT_CORNER',
    RIGHT_CORNER = 'RIGHT_CORNER',
}

export interface BorderCords extends Vector {
    side: BorderCordsSide;
}

export interface BorderCordsData<EntityData> {
    entity: EntityData;
    cords: BorderCords[];
}

export interface BrickData {
    x: number;
    y: number;
    key: string;
}
