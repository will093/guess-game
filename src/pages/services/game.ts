import { Injectable } from '@angular/core';
import { Character } from './character';
import { CharacterGenerator } from './character-generator';
import { MessageService } from './message-service';
import { OpponentPlayer, OwnPlayer } from './player';
import { StartGameMessage, EndGameMessage } from './message';
import { IEvent, Event} from './event';

// Model for the game itself.
@Injectable()
export class Game {

    private _isOwnTurn: boolean;

    private _characters: Array < Character > ;

    private _gameOver: boolean;

    private _gameOverVictory: boolean;

    constructor(private _characterGenerator: CharacterGenerator, private _ownPlayer: OwnPlayer, 
        private _opponentPlayer: OpponentPlayer, private _messageService: MessageService) {
        console.log('Game constructor executing.');

        // Subscribe our callback functions to the appropriate events - subscribe once in constructor, and then never unsubscribe.
        _messageService.onStartGame.subscribe(this.gameStarted);
        _messageService.onEndTurn.subscribe(this.turnEnded);
        _messageService.onEndGame.subscribe(this.characterGuessed);
    }


    // Reset the game to its initial state, ready to start a new game.
    public resetGameState = (): void => {
        this._isOwnTurn = undefined;
        this._characters = undefined;

        this._gameOver = undefined;
        this._gameOverVictory = undefined;

        this._ownPlayer.role = undefined;
        this._ownPlayer.characterId = undefined;
        this._ownPlayer.isAsking = undefined;

        this._opponentPlayer.role = undefined;
        this._opponentPlayer.characterId = undefined;
        console.log('Game state was reset, ready for a new game.');
    }

    // Start the game - host sets up the game and sends the initial game data to the opponent.
    public startGame = (characterPack: string): void => {
        console.log('Starting game...');
        let getRandomId = (characters: Array < Character > ): string => {
            var randomIndex = Math.floor(Math.random() * characters.length);
            return characters[randomIndex].characterId;
        };

        let characters = this._characterGenerator.generateCharacterPack(characterPack).characterSet;
        let ownCharacterId = getRandomId(characters);
        let opponentCharacterId = getRandomId(characters);
        let isOwnTurn = !!Math.floor(Math.random() * 2);

        this.setUpGame(ownCharacterId, opponentCharacterId, isOwnTurn, characters);           

        this._messageService.startNewGame(ownCharacterId, opponentCharacterId, isOwnTurn, characters);

        // Game has now been initialised.
        this.onGameStarted.trigger();
    }

    // Callback function, invoked when the other device starts a new game.
    private gameStarted = (message: StartGameMessage): void => {
        console.log('StartGameMessage received:');
        console.log(message);

        // Both host and opponent have the same fixed character set for now, so both can generate the characters locally.
        this.setUpGame(message.receiverCharacterId, message.senderCharacterId, message.isReceiverTurn, message.characters);

        this.onGameStarted.trigger();
    }

    private setUpGame = (ownCharacterId: string, opponentCharacterId: string, isOwnTurn: boolean, characters: Array < Character >): void => {
        this._characters = characters;

        this._ownPlayer.characterId = ownCharacterId;
        this._opponentPlayer.characterId = opponentCharacterId;
        this._isOwnTurn = isOwnTurn;
    }

    public endTurn = (): void => {
        // Eliminate each selected character.
        this._characters.forEach(character => {
            if (character.isSelected) {
                character.isEliminated = true;
            }
        });

        this._isOwnTurn = false;
        this.onTurnEnded.trigger();

        console.log('Turn ended.');
        this._messageService.endTurn();
    }

    // Callback function, invoked when the other device ends their turn.
    private turnEnded = (): void => {
        console.log('EndTurnMessage received.');
        this._isOwnTurn = true;

        this.onTurnEnded.trigger();
    }

    public guessCharacter = (characterId: string): boolean => {
        let guessCorrect = (characterId === this._opponentPlayer.characterId);
        this._messageService.endGame(guessCorrect);

        this._gameOver = true;
        this._gameOverVictory = guessCorrect;

        this.onGameEnded.trigger();

        console.log('Character guessed.');
        return guessCorrect;
    }

    // Callback function, invoked when the other device guesses a character.
    public characterGuessed = (message: EndGameMessage): void => {
        console.log('EndGameMessage received:');       
        console.log(message);

        this._gameOver = true;
        this._gameOverVictory = message.receiverWins;

        this.onGameEnded.trigger();
    }

    // Events which other parties may be interested in.
    public onGameStarted: IEvent<void> = new Event<void>();

    public onTurnEnded: IEvent<void> = new Event<void>();

    public onGameEnded: IEvent<void> = new Event<void>();

    get isOwnTurn(): boolean {
        return this._isOwnTurn;
    }

    get characters(): Array < Character > {
        return this._characters;
    }

    get gameOver(): boolean {
        return this._gameOver;
    }

    get gameOverVictory(): boolean {
        return this._gameOverVictory;
    }
}

