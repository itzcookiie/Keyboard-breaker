import './style.css';

import Game from './game';
import * as entities from './entities/index'
import * as uis from './view/index'

import { loadImages } from './lib';
import { GCLOUD_BASE_URL } from './constants';

const IMAGES = [
    {name: 'heart', path: '/heart.png'},
    {name: 'arrow', path: '/arrow.png'}
];

window.document.addEventListener('DOMContentLoaded', async() => {
    const images = await loadImages(IMAGES, GCLOUD_BASE_URL);
    const game = new Game(images);
    game.init();
    game.registerEntities(entities.Bricks, entities.Board, entities.Ball);
    game.registerUis(...Object.values(uis));
    game.startGame();
})