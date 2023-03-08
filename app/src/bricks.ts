import Game, { GameLevel } from './game';


interface BrickData {
    x: number;
    y: number;
    key: string;
}

type BricksData = BrickData[];


class Bricks {
    data: BrickData;

    constructor() {

    }
}

class Brick {
    data: BrickData;

    constructor(data: BrickData) {
        this.data = data;
    }

    matchCords(x: number, y: number): boolean {
        return x === this.data.x && y === this.data.y;
    }
}


export { }