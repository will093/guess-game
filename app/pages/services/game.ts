import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Character } from './character';
import { CharacterGenerator } from './character-generator';
import { MessageService } from './message-service';
import { OpponentPlayer, OwnPlayer, PlayerRole } from './player';
import { StartGameMessage, EndGameMessage } from './message';

// Model for the game itself.
@Injectable()
export class Game {

    private _isOwnTurn: boolean;

    private _characters: Array < Character > ;

    // Resolved when the game has been started
    private _gameStarted: Promise < void >;
    private _resolveGameStarted: Function;

    private _gameOver: boolean;

    private _gameOverVictory: boolean;

    constructor(private characterGenerator: CharacterGenerator, private ownPlayer: OwnPlayer, 
        private opponentPlayer: OpponentPlayer, private messageService: MessageService, private _changeDetector: ChangeDetectorRef) {
        // Subscribe our callback functions to the appropriate events - subscribe once in constructor, and then never unsubscribe.
        messageService.onStartGame.subscribe(this.gameStarted);
        messageService.onEndTurn.subscribe(this.turnEnded);
        messageService.onEndGame.subscribe(this.characterGuessed);

        // Set up the promise which will be resolved when the game is started.
        this._gameStarted = new Promise <void> ((resolve, reject) => { 
            this._resolveGameStarted = resolve; 
        });
    }


    public startNewGame = (): Promise < void > => {

        // Host sets up game and then sends game data to opponent.
        if (this.ownPlayer.role === PlayerRole.Host) {

            let getRandomId = (characters: Array < Character > ): string => {
                var randomIndex = Math.floor(Math.random() * characters.length);
                return characters[randomIndex].characterId;
            };

            let characters = this.characterGenerator.generateCharacterSet();
            let ownCharacterId = getRandomId(characters);
            let opponentCharacterId = getRandomId(characters);
            let isOwnTurn = !!Math.floor(Math.random() * 2);

            this.setUpGame(ownCharacterId, opponentCharacterId, isOwnTurn, characters);           

            this.messageService.startNewGame(ownCharacterId, opponentCharacterId, isOwnTurn);

            // Game has now been initialised.
            this._resolveGameStarted();
        }

        return this._gameStarted;
    }

    // Callback function, invoked when the other device starts a new game.
    private gameStarted = (message: StartGameMessage): void => {
        console.log('StartGameMessage received:');
        console.log(message);

        // Both host and opponent have the same fixed character set for now, so both can generate the characters locally.
        let characters = this.characterGenerator.generateCharacterSet();
        this.setUpGame(message.receiverCharacterId, message.senderCharacterId, message.isReceiverTurn, characters);

        // Game has now been initialised by the Host.
        this._resolveGameStarted();
    }

    private setUpGame = (ownCharacterId: string, opponentCharacterId: string, isOwnTurn: boolean, characters: Array < Character >): void => {
        this._characters = characters;

        this.ownPlayer.characterId = ownCharacterId;
        this.opponentPlayer.characterId = opponentCharacterId;
        this._isOwnTurn = isOwnTurn;
    }

    public endTurn = (): void => {
        // Eliminate each selected character.
        this._characters.forEach(character => {
            if (character.isSelected) {
                character.isSelected = false;
                character.isEliminated = true;
            }
        });

        this._isOwnTurn = false;

        this.messageService.endTurn();
    }

    // Callback function, invoked when the other device ends their turn.
    private turnEnded = (): void => {
        console.log('EndTurnMessage received.');
        this._isOwnTurn = true;

        // Required to propagate changes through to UI.
        this._changeDetector.detectChanges();
    }

    public guessCharacter = (characterId: string): boolean => {
        let guessCorrect = (characterId === this.opponentPlayer.characterId);
        this.messageService.endGame(guessCorrect);

        this._gameOver = true;
        this._gameOverVictory = guessCorrect;

        return guessCorrect;
    }

    // Callback function, invoked when the other device guesses a character.
    public characterGuessed = (message: EndGameMessage): void => {
        console.log('EndGameMessage received:');       
        console.log(message);

        this._gameOver = true;
        this._gameOverVictory = message.receiverWins;
    }

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

