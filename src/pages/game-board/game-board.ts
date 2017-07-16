import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { find, flatten, map } from 'lodash';

import { Character } from '../../models/character';
import { OwnPlayer, PlayerRole } from '../../models/player';
import { Game } from '../../services/game';
import { MessageService } from '../../services/message-service';
import { MainMenuPage } from '../main-menu/main-menu';
import { ConfirmGuessModal } from './modals/confirm-guess-modal';
import { DataErrorModal } from './modals/data-error-modal';
import { GameOverModal } from './modals/game-over-modal';
import { ReturnToMenuModal } from './modals/return-to-menu-modal';


@Component({
    selector: 'game-board-page',
    templateUrl: 'game-board.html',
})
export class GameBoardPage {

    public gameLoading: Boolean = true;

    public characterGrid: Array<Array<Character>>;

    public ownCharacter: Character;

    private unRegisterBackButtonAction: Function;

    constructor(public game: Game, public ownPlayer: OwnPlayer, private _nav: NavController, private _modalCtrl: ModalController,
        private _messageService: MessageService, private _params: NavParams, private _platform: Platform) {
        // Subscribe to game started event in constructor so that we always subscribe before the start game event occurs. 
        // TODO this is still kind of a race condition, consider taking further action to prevent.
        this.game.onGameStarted.subscribe(this.gameStarted);
    }

    ionViewDidLoad() {
        this.setBackButtonActionToShowModal();

        this.game.onGameEnded.subscribe(this.gameEnded);
        this._messageService.onDataReceivedError.subscribe(this.dataReceivedError);
        if (this.ownPlayer.role === PlayerRole.Host) {
            var characterPack = this._params.get('characterPack');
            this.game.startGame(characterPack);
        }
    }

    private setBackButtonActionToShowModal() {
        this.unRegisterBackButtonAction = this._platform.registerBackButtonAction(() => {
            this.backButtonTapped();
        }, 200);
    }

    public characterTapped = (character: Character): void => {
        if (this.game.isOwnTurn && !character.isEliminated && (character.isSelected || this.moreThanOneUnflipped(flatten(this.characterGrid)))) {
            character.isSelected = !character.isSelected;
        }
    }

    public endTurnTapped = (): void => {
        if (!this.moreThanOneUnflipped(this.game.characters)) {
            this.confirmGuess();
            return;
        }

        this.game.endTurn();
        this.deselectAllCharacters();
    }

    private confirmGuess = (): void => {
        const character = this.game.characters.find(character => !character.isSelected && !character.isEliminated);

        let confirmGuessModal = this._modalCtrl.create(ConfirmGuessModal, { character: character });

        confirmGuessModal.onDidDismiss(confirmed => {
            if (confirmed) {
                this.game.guessCharacter(character.characterId);
            }
        });

        confirmGuessModal.present();
    }

    public backButtonTapped = () => {
        let returnToMenuModal = this._modalCtrl.create(ReturnToMenuModal);

        returnToMenuModal.onDidDismiss(confirmed => {
            if (confirmed) {
                this.returnToMenu();
            } else {
                this.unRegisterBackButtonAction();
                this.setBackButtonActionToShowModal();
            }
        });

        this.unRegisterBackButtonAction();
        this.unRegisterBackButtonAction = this._platform.registerBackButtonAction(() => {}, 200);

        returnToMenuModal.present();
    }

    public returnToMenu = (): void => {
        this._nav.setRoot(MainMenuPage);
    }

    ionViewWillUnload() {
        this.game.resetGameState();
        // Ensure we unsubscribe from all events.
        this._messageService.onDataReceivedError.unsubscribe(this.dataReceivedError);
        this.game.onGameEnded.unsubscribe(this.gameEnded);
        this.game.onGameStarted.unsubscribe(this.gameStarted);
        this.unRegisterBackButtonAction();
    }

    private deselectAllCharacters = (): void => {
        var characters = flatten(this.characterGrid);
        map(characters, (character: Character) => character.isSelected = false);
    }

    private moreThanOneUnflipped = (characters: Array<Character>): Boolean => {
        return characters.filter(character => !character.isSelected && !character.isEliminated).length > 1;
    }

    // Callback function which displays a modal when the game ends.
    private gameEnded = (): void => {
        // Don't show error message if other player disconnects after the game has ended.
        this._messageService.onDataReceivedError.unsubscribe(this.dataReceivedError);
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

        this.ownCharacter = find(this.game.characters, (character: Character) => {
            return character.characterId === this.ownPlayer.characterId;
        });
        this.gameLoading = false;
    }

    private dataReceivedError = (): void => {
        let dataErrorModal = this._modalCtrl.create(DataErrorModal);

        dataErrorModal.onDidDismiss(data => {
            this.returnToMenu();
        });

        dataErrorModal.present();
    }
}
