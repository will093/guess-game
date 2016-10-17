import { Injectable } from '@angular/core';
import { Character } from './character';
import * as _ from 'lodash';

// TODO: this should implement an interface. Can we then inject it with the type of the interface?
// Service for generating character sets.
@Injectable()
export class CharacterGenerator {

    public generateCharacterSet = (): Array < Character > => {
        let characters = [
            { characterId: '1', imagePath: 'build/images/test-set/1.jpg', name: 'Ling', isSelected: false, isEliminated: false },
            { characterId: '2', imagePath: 'build/images/test-set/2.jpg', name: 'Sydney', isSelected: false, isEliminated: false },
            { characterId: '3', imagePath: 'build/images/test-set/3.jpg', name: 'Toby', isSelected: false, isEliminated: false },
            { characterId: '4', imagePath: 'build/images/test-set/4.jpg', name: 'Timothy', isSelected: false, isEliminated: false },
            { characterId: '5', imagePath: 'build/images/test-set/5.jpg', name: 'Jasmine', isSelected: false, isEliminated: false },
            { characterId: '6', imagePath: 'build/images/test-set/6.jpg', name: 'Daniel', isSelected: false, isEliminated: false },
            { characterId: '7', imagePath: 'build/images/test-set/7.jpg', name: 'Parker', isSelected: false, isEliminated: false },
            { characterId: '8', imagePath: 'build/images/test-set/8.jpg', name: 'Vanessa', isSelected: false, isEliminated: false },
            { characterId: '9', imagePath: 'build/images/test-set/9.jpg', name: 'Jim', isSelected: false, isEliminated: false },
            { characterId: '10', imagePath: 'build/images/test-set/10.jpg', name: 'Sebastian', isSelected: false, isEliminated: false },
            { characterId: '11', imagePath: 'build/images/test-set/11.jpg', name: 'Mike', isSelected: false, isEliminated: false },
            { characterId: '12', imagePath: 'build/images/test-set/12.jpg', name: 'Charlotte', isSelected: false, isEliminated: false },
            { characterId: '13', imagePath: 'build/images/test-set/13.jpg', name: 'Sean', isSelected: false, isEliminated: false },
            { characterId: '14', imagePath: 'build/images/test-set/14.jpg', name: 'Hayley', isSelected: false, isEliminated: false },
            { characterId: '15', imagePath: 'build/images/test-set/15.jpg', name: 'Rupert', isSelected: false, isEliminated: false },
            { characterId: '16', imagePath: 'build/images/test-set/16.jpg', name: 'Linda', isSelected: false, isEliminated: false },
            { characterId: '17', imagePath: 'build/images/test-set/17.jpg', name: 'Erica', isSelected: false, isEliminated: false },
            { characterId: '18', imagePath: 'build/images/test-set/18.jpg', name: 'Tia', isSelected: false, isEliminated: false },
            { characterId: '19', imagePath: 'build/images/test-set/19.jpg', name: 'Marcus', isSelected: false, isEliminated: false },
            { characterId: '20', imagePath: 'build/images/test-set/20.jpg', name: 'Sally', isSelected: false, isEliminated: false },
            { characterId: '21', imagePath: 'build/images/test-set/21.jpg', name: '?', isSelected: false, isEliminated: false },
        ];

        return _.cloneDeep(characters);
    }
}

