import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Game } from '../services/game';
import { OwnPlayer } from '../services/player';
import { Character } from '../services/character';
import { MainMenuPage } from '../main-menu/main-menu';
import { ModalController } from 'ionic-angular';
import { GameOverModal } from './modals/game-over-modal';
import { ConfirmGuessModal } from './modals/confirm-guess-modal';
import * as _ from 'lodash';

@Component({
    templateUrl: 'build/pages/game-board/game-board.html',
})
export class GameBoardPage {

    public gameLoading: Boolean = true;

    public characterGrid: Array < Array < Character >> ;

    public ownCharacter: Character;

    constructor(public game: Game, public ownPlayer: OwnPlayer, private _nav: NavController, private _modalCtrl: ModalController) {
        this.game.onGameStarted.subscribe(this.gameStarted);
        this.game.onGameEnded.subscribe(this.gameEnded);
        this.game.startGame();
    }

    public characterTapped = (character: Character): void => {
        if (this.ownPlayer.isAsking && !character.isEliminated 
            && (character.isSelected || this.moreThanOneUnflipped(_.flatten(this.characterGrid)))) {
            character.isSelected = !character.isSelected;
        }

        if (this.ownPlayer.isGuessing && !character.isEliminated) {
            this.confirmGuess(character);
            this.ownPlayer.isGuessing = false;
        }
    }

    private moreThanOneUnflipped = (characters: Array < Character > ): Boolean => {
        return characters.filter(character => !character.isSelected && !character.isEliminated).length > 1;
    }

    private confirmGuess = (character: Character): void => {
        let confirmGuessModal = this._modalCtrl.create(ConfirmGuessModal, { character: character });

        confirmGuessModal.onDidDismiss(data => {
            if (data) {
                this.game.guessCharacter(character.characterId);
            }
        });

        confirmGuessModal.present();
    }

    public askTapped = (): void => {
        if (this.game.isOwnTurn && !this.game.gameOver) {
            this.ownPlayer.isAsking = true;
        }
    }

    public endTurn = (): void => {
        this.game.endTurn();
        this.ownPlayer.isAsking = false;
        this.deselectAllCharacters();
    }

    public cancelAsk = (): void => {
        this.ownPlayer.isAsking = false;
        this.deselectAllCharacters();
    };

    public guessTapped = (): void => {
        if (this.game.isOwnTurn && !this.game.gameOver) {
            this.ownPlayer.isGuessing = true;
        }
    }

    public cancelGuess = (): void => {
        this.ownPlayer.isGuessing = false;
    }

    private deselectAllCharacters = (): void => {
        var characters = _.flatten(this.characterGrid);
        _.map(characters, (character: Character) => character.isSelected = false);
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
            this.game.characters.slice(0, 6),
            this.game.characters.slice(6, 12),
            this.game.characters.slice(12, 18),
        ];

        this.ownCharacter = _.find(this.game.characters, (character: Character) => {
            return character.characterId === this.ownPlayer.characterId;
        });
        this.gameLoading = false;
    }
}
