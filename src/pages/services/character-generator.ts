import { Injectable } from '@angular/core';
import { Character } from './character';
import * as _ from 'lodash';

// TODO: this should implement an interface. Can we then inject it with the type of the interface?
// Service for generating character sets.
@Injectable()
export class CharacterGenerator {

    public generateCharacterPack = (setName: string): Array < Character > => {
        return _.cloneDeep(this.characterPack[setName]);
    }

    private characterPack = {
        testPack: [
            { characterId: '1', imagePath: 'assets/img/test-pack/1.jpg', name: 'Ling', isSelected: false, isEliminated: false },
            { characterId: '2', imagePath: 'assets/img/test-pack/2.jpg', name: 'Sydney', isSelected: false, isEliminated: false },
            { characterId: '3', imagePath: 'assets/img/test-pack/3.jpg', name: 'Toby', isSelected: false, isEliminated: false },
            { characterId: '4', imagePath: 'assets/img/test-pack/4.jpg', name: 'Timothy', isSelected: false, isEliminated: false },
            { characterId: '5', imagePath: 'assets/img/test-pack/5.jpg', name: 'Jasmine', isSelected: false, isEliminated: false },
            { characterId: '6', imagePath: 'assets/img/test-pack/6.jpg', name: 'Daniel', isSelected: false, isEliminated: false },
            { characterId: '7', imagePath: 'assets/img/test-pack/7.jpg', name: 'Parker', isSelected: false, isEliminated: false },
            { characterId: '8', imagePath: 'assets/img/test-pack/8.jpg', name: 'Vanessa', isSelected: false, isEliminated: false },
            { characterId: '9', imagePath: 'assets/img/test-pack/9.jpg', name: 'Jim', isSelected: false, isEliminated: false },
            { characterId: '10', imagePath: 'assets/img/test-pack/10.jpg', name: 'Sebastian', isSelected: false, isEliminated: false },
            { characterId: '11', imagePath: 'assets/img/test-pack/11.jpg', name: 'Mike', isSelected: false, isEliminated: false },
            { characterId: '12', imagePath: 'assets/img/test-pack/12.jpg', name: 'Charlotte', isSelected: false, isEliminated: false },
            { characterId: '13', imagePath: 'assets/img/test-pack/13.jpg', name: 'Sean', isSelected: false, isEliminated: false },
            { characterId: '14', imagePath: 'assets/img/test-pack/14.jpg', name: 'Hayley', isSelected: false, isEliminated: false },
            { characterId: '15', imagePath: 'assets/img/test-pack/15.jpg', name: 'Rupert', isSelected: false, isEliminated: false },
            { characterId: '16', imagePath: 'assets/img/test-pack/16.jpg', name: 'Linda', isSelected: false, isEliminated: false },
            { characterId: '17', imagePath: 'assets/img/test-pack/17.jpg', name: 'Erica', isSelected: false, isEliminated: false },
            { characterId: '18', imagePath: 'assets/img/test-pack/18.jpg', name: 'Tia', isSelected: false, isEliminated: false },
        ],
        memesPack: [
            { characterId: '19', imagePath: 'assets/img/memes-pack/advice-dog.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '20', imagePath: 'assets/img/memes-pack/annoying-facebook-girl.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '21', imagePath: 'assets/img/memes-pack/bad-luck-brian.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '22', imagePath: 'assets/img/memes-pack/business-cat.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '23', imagePath: 'assets/img/memes-pack/confession-bear.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '24', imagePath: 'assets/img/memes-pack/depression-dog.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '25', imagePath: 'assets/img/memes-pack/foul-bachelor-frog.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '26', imagePath: 'assets/img/memes-pack/good-guy-greg.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '27', imagePath: 'assets/img/memes-pack/high-expectations-father.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '28', imagePath: 'assets/img/memes-pack/insanity-wolf.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '29', imagePath: 'assets/img/memes-pack/lame-pun-coon.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '30', imagePath: 'assets/img/memes-pack/musically-oblivious-8th-grader.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '31', imagePath: 'assets/img/memes-pack/overly-attached-girlfriend.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '32', imagePath: 'assets/img/memes-pack/paranoid-parrot.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '33', imagePath: 'assets/img/memes-pack/philosoraptor.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '34', imagePath: 'assets/img/memes-pack/scumbag-steve.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '35', imagePath: 'assets/img/memes-pack/socially-awkward-penguin.jpg', name: '?', isSelected: false, isEliminated: false },
            { characterId: '36', imagePath: 'assets/img/memes-pack/success-kid.jpg', name: '?', isSelected: false, isEliminated: false },
        ],
    };
}

