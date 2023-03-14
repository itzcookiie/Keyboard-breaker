import './style.css';

import Game, { GameLevel } from './game';
import Bricks from './entities/bricks';
import Board from './entities/board';
import Ball from './entities/ball';


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext("2d");
// ctx.font = "40px Arial";
// const result = ctx?.measureText("Hello world");

// const experiment = ['1234567', 'QWERTYU', 'ASDFGHJ', 'ZXCVBNM']
// experiment.forEach((keyRow, index) => keyRow.split('').map(key => {
//     const result = ctx?.measureText(key);
//     console.log(`Result ${index + 1}:`)
//     console.log(result?.fontBoundingBoxAscent)
//     console.log(result?.fontBoundingBoxDescent)
//     console.log(`Result finish`)
// }))

window.document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.registerEntities(Bricks, Board, Ball);
    game.runGameLoop();
})