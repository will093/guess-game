import { Injectable } from 'angular2/core';
import { Character } from './character';
import { CharacterGenerator } from './character-generator';

@Injectable()
export class Game {

    public isOwnTurn: boolean;

    private characters: Array < Character > ;

    private ownPlayer: Player;

    private opponentPlayer: Player;

    constructor(characterGenerator: CharacterGenerator, private ownPlayer: OwnPlayer, private opponentPlayer: OpponentPlayer) {

        let getRandomId = (characters: Array < Character > ): string => {
            var randomIndex = Math.floor(Math.random() * characters.length);
            return characters[randomIndex].characterId;
        };

        // Host sets up game and then sends game data to opponent.
        if (ownPlayer.role === PlayerRole.Host) {
            characters = characterGenerator.generateCharacterSet();
            ownPlayer.characterId = getRandomId(characters);
            opponentPlayer.characterId = getRandomId(characters);
            isOwnTurn = !!Math.floor(Math.random() * 2);
        }

    }

}

