import Game from "../game";

class HtmlUI {
    gameOverPopUp: HTMLDivElement | null = document.querySelector('.game-over-pop-up');
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.attachEventListeners();
    }

    showGameOverPopUp() {
        if(!this.gameOverPopUp) return;
        this.gameOverPopUp.style.display = 'flex';
    }

    hideGameOverPopUp() {
        if(!this.gameOverPopUp) return;
        this.gameOverPopUp.style.display = 'none';
    }

    attachEventListeners() {
        if(!this.gameOverPopUp) return;
        const button = this.gameOverPopUp.querySelector('button');
        if(!button) return;
        button.addEventListener('click', () => {
            this.game.reset();
            this.hideGameOverPopUp();
        })
    }
}

export default HtmlUI;