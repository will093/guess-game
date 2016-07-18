import { Page } from 'ionic-angular';
import { Game } from '../services/game';

@Page({
    templateUrl: 'build/pages/game-board/game-board.html',
})

export class GameBoardPage {

    constructor(private game: Game) {}

    onPageWillEnter(): void {
        this.game.startNewGame();
    }
}

