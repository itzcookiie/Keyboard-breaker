import './style.css';

import Game from './game';
import * as entities from './entities/index'
import * as uis from './view/index'

import { loadImages } from './lib';


const IMAGES = [
    {name: 'heart', path: '/heart.png'},
    {name: 'arrow', path: '/arrow.png'}
];

window.document.addEventListener('DOMContentLoaded', async() => {
    const images = await loadImages(IMAGES);
    const game = new Game(images);
    game.init();
    game.registerEntities(...Object.values(entities));
    game.registerUis(...Object.values(uis));
    game.startGame();
})