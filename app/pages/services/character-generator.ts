import { Injectable } from '@angular/core';
import { Character } from './character';
import * as _ from 'lodash';

// TODO: this should implement an interface. Can we then inject it with the type of the interface?
// Service for generating character sets.
@Injectable()
export class CharacterGenerator {

    public generateCharacterSet = (): Array < Character > => {
        let characters = [
            { characterId: '1', imagePath: 'build/images/test-set/1.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '2', imagePath: 'build/images/test-set/2.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '3', imagePath: 'build/images/test-set/3.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '4', imagePath: 'build/images/test-set/4.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '5', imagePath: 'build/images/test-set/5.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '6', imagePath: 'build/images/test-set/6.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '7', imagePath: 'build/images/test-set/7.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '8', imagePath: 'build/images/test-set/8.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '9', imagePath: 'build/images/test-set/9.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '10', imagePath: 'build/images/test-set/10.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '11', imagePath: 'build/images/test-set/11.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '12', imagePath: 'build/images/test-set/12.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '13', imagePath: 'build/images/test-set/13.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '14', imagePath: 'build/images/test-set/14.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '15', imagePath: 'build/images/test-set/15.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '16', imagePath: 'build/images/test-set/16.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '17', imagePath: 'build/images/test-set/17.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '18', imagePath: 'build/images/test-set/18.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '19', imagePath: 'build/images/test-set/19.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '20', imagePath: 'build/images/test-set/20.jpg', name: '', isSelected: false, isEliminated: false },
            { characterId: '21', imagePath: 'build/images/test-set/21.jpg', name: '', isSelected: false, isEliminated: false },
        ];

        return _.cloneDeep(characters);
    }
}

