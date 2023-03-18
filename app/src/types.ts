import Game from "./game";
import Ball from "./entities/ball";
import Board from "./entities/board";
import Bricks from "./entities/bricks";

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

export interface BallLevel extends Vector {
    xVelocity: number;
    yVelocity: number;
};

export enum BorderCordsSide {
    LEFT = 'LEFT',
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT_CORNER = 'LEFT_CORNER',
    RIGHT_CORNER = 'RIGHT_CORNER',
};

export interface BorderCords extends Vector {
    side: BorderCordsSide;
};


export interface BorderCordsData<EntityData> {
    entity: EntityData;
    cords: BorderCords[];
};

export interface BrickData {
    x: number;
    y: number;
    key: string;
};

export interface LoadedImage {
    name: string;
    path: string;
    element: HTMLImageElement;
};

export enum UIElementType {
    IMAGE = 'image',
    TEXT = 'text'
};

export enum UIElement {
    SCORE = 'score',
    HEART_ICONS = 'heartIcons'
};

export interface UIElementData {
    name: UIElement;
    cords: Vector[];
    type: UIElementType;
};

export enum SoundAlias {
    BACKGROUND = 'BACKGROUND',
    BRICK_HIT = 'BRICK_HIT',
    GROUND_HIT = 'GROUND_HIT',
    WALL_HIT = 'WALL_HIT'
};