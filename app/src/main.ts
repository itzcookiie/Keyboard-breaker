import './style.css';

import Game from './game';
import Bricks from './entities/bricks';
import Board from './entities/board';
import Ball from './entities/ball';
import UIElements from './entities/uiElements';

import { loadImages } from './lib';


// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
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


const IMAGES = [
    {'name': 'heart', path: '/heart.png'}
];

window.document.addEventListener('DOMContentLoaded', async() => {
    const images = await loadImages(IMAGES);
    const game = new Game(images);
    game.registerEntities(Bricks, Board, Ball, UIElements);
    game.runGameLoop();
})