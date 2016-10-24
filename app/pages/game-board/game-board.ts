import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Game } from '../services/game';
import { OwnPlayer } from '../services/player';
import { Character } from '../services/character';
import { MainMenuPage } from '../main-menu/main-menu';
import { ModalController } from 'ionic-angular';
import { GameOverModal } from './modals/game-over-modal';
import * as _ from 'lodash';

@Component({
    templateUrl: 'build/pages/game-board/game-board.html',
})
export class GameBoardPage {

    public gameLoading: Boolean = true;

    public characterGrid: Array < Array < Character >> ;

    public ownCharacter: Character;

    constructor(public game: Game, private _ownPlayer: OwnPlayer, private _nav: NavController, private _modalCtrl: ModalController) {
        this.game.onGameStarted.subscribe(this.gameStarted);
        this.game.onGameEnded.subscribe(this.gameEnded);
        this.game.startGame();
    }

    public characterTapped = (character: Character): void => {
        // Character can only be selected if it is the players turn and the character is not already eliminated.
        if (!this.game.isOwnTurn || this.game.gameOver || character.isEliminated) {
            return;
        }
        // Toggle whether the character is selected.
        character.isSelected = !character.isSelected;
    }

    public endTurn = (): void => {
        if (!this.game.isOwnTurn || this.game.gameOver) {
            return;
        }

        this.game.endTurn();
    }

    public guessSelectedCharacter = (): void => {
        if (!this.game.isOwnTurn || this.game.gameOver) {
            return;
        }

        let selectedCharacters = _.filter(this.game.characters, function(character) {
            return character.isSelected;
        });

        if (selectedCharacters.length === 1) {
            this.game.guessCharacter(selectedCharacters[0].characterId);
        }
    }

    public returnToMenu = (): void => {
        this._nav.setRoot(MainMenuPage);
    }

    ionViewDidUnload() {
        this.game.resetGameState();
        this.game.onGameEnded.unsubscribe(this.gameEnded);
        this.game.onGameStarted.unsubscribe(this.gameStarted);
        this.returnToMenu();
    }

    // Callback function which displays a modal when the game ends.
    private gameEnded = (): void => {
        let gameOverModal = this._modalCtrl.create(GameOverModal, { gameOverVictory: this.game.gameOverVictory });

        gameOverModal.onDidDismiss(data => {
            this.returnToMenu();
        });

        gameOverModal.present();
    }

    private gameStarted = (): void => {
        this.characterGrid = [
            this.game.characters.slice(0, 5),
            this.game.characters.slice(5, 10),
            this.game.characters.slice(10, 15),
            this.game.characters.slice(15, 20),
        ];

        this.ownCharacter = _.find(this.game.characters, (character: Character) => {
            return character.characterId === this._ownPlayer.characterId;
        });
        this.gameLoading = false;
    }
}
