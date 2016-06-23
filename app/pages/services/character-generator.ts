import { Injectable } from 'angular2/core';
import { Character } from './character';

@Injectable()
export class CharacterGenerator {

    public generateCharacterSet = (): Array < Character > => {
        return [
            { characterId: '1', imagePath: '', name: '' },
            { characterId: '2', imagePath: '', name: '' },
            { characterId: '3', imagePath: '', name: '' },
            { characterId: '4', imagePath: '', name: '' },
            { characterId: '5', imagePath: '', name: '' },
            { characterId: '6', imagePath: '', name: '' },
            { characterId: '7', imagePath: '', name: '' },
            { characterId: '8', imagePath: '', name: '' },
            { characterId: '9', imagePath: '', name: '' },
            { characterId: '10', imagePath: '', name: '' },
            { characterId: '11', imagePath: '', name: '' },
            { characterId: '12', imagePath: '', name: '' },
            { characterId: '13', imagePath: '', name: '' },
            { characterId: '14', imagePath: '', name: '' },
            { characterId: '15', imagePath: '', name: '' },
            { characterId: '16', imagePath: '', name: '' },
            { characterId: '17', imagePath: '', name: '' },
            { characterId: '18', imagePath: '', name: '' },
            { characterId: '19', imagePath: '', name: '' },
            { characterId: '20', imagePath: '', name: '' },
            { characterId: '21', imagePath: '', name: '' },
        ];
    }
}

