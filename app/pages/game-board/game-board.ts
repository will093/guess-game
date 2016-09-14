import { Page } from 'ionic-angular';
import { Game } from '../services/game';
import { OwnPlayer } from '../services/player';
import { Character } from '../services/character';
import * as _ from 'lodash';


@Page({
    templateUrl: 'build/pages/game-board/game-board.html',
})
export class GameBoardPage {

    public gameLoading: Boolean = true;

    public characterRow1: Array < Character >;
    public characterRow2: Array < Character >;
    public characterRow3: Array < Character >;

    public ownCharacter: Character;

    constructor(public game: Game, private _ownPlayer: OwnPlayer) {
        this.game.startNewGame().then(() => {
            // Separate the characters into 2 rows. TODO: Is there a neater way of doing this?
            this.characterRow1 = this.game.characters.slice(0, 7);
            this.characterRow2 = this.game.characters.slice(7, 14);
            this.characterRow3 = this.game.characters.slice(14, 21);

            this.ownCharacter = _.find(this.game.characters, (character: Character) => {
                return character.characterId === this._ownPlayer.characterId;
            });
            this.gameLoading = false;
        });
    }

    public characterTapped = (character: Character): void => {
        // Character can only be selected if it is the players turn and the character is not already eliminated.
        if (!this.game.isOwnTurn || character.isEliminated) {
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

        let selectedCharacters = _.filter(this.game.characters, function(character) { return character.isSelected; });

        if (selectedCharacters.length === 1) {
            this.game.guessCharacter(selectedCharacters[0].characterId);
        }
    }
}

