import { Injectable } from '@angular/core';
import { Character } from './character';
import { CharacterGenerator } from './character-generator';
import { MessageService } from './message-service';
import { OpponentPlayer, OwnPlayer, PlayerRole } from './player';
import { StartGameMessage } from './message';

// Model for the game itself.
@Injectable()
export class Game {

    public isOwnTurn: boolean;

    public characters: Array < Character > ;

    constructor(private characterGenerator: CharacterGenerator, private ownPlayer: OwnPlayer, 
        private opponentPlayer: OpponentPlayer, private messageService: MessageService) {
        // Subscribe our callback functions to appropriate events.
        messageService.onStartGame.subscribe(this.gameStarted);
    }

    public startNewGame = (): void => {

        this.characters = this.characterGenerator.generateCharacterSet();

        // Host sets up game and then sends game data to opponent.
        if (this.ownPlayer.role === PlayerRole.Host) {

            let getRandomId = (characters: Array < Character > ): string => {
                var randomIndex = Math.floor(Math.random() * characters.length);
                return characters[randomIndex].characterId;
            };

            let ownCharacterId = getRandomId(this.characters);
            let opponentCharacterId = getRandomId(this.characters);
            let isOwnTurn = !!Math.floor(Math.random() * 2);

            this.setUpGame(ownCharacterId, opponentCharacterId, isOwnTurn);           

            this.messageService.startNewGame(ownCharacterId, opponentCharacterId, isOwnTurn);
        }
    }

    // Callback function, invoked when the other device starts a new game.
    private gameStarted = (message: StartGameMessage): void => {
        console.log('Game started:');
        console.log(message);
        this.setUpGame(message.receiverCharacterId, message.senderCharacterId, message.isReceiverTurn);
    }

    private setUpGame = (ownCharacterId: string, opponentCharacterId: string, isOwnTurn: boolean): void => {
        this.ownPlayer.characterId = ownCharacterId;
        this.opponentPlayer.characterId = opponentCharacterId;
        this.isOwnTurn = isOwnTurn;
    }

}

