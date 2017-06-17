import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { testPack } from '../character-packs/test';
import { memesPack } from '../character-packs/memes';
import { CharacterPack } from './character-pack';

// TODO: this should implement an interface. Can we then inject it with the type of the interface?
// Service for generating character sets.
@Injectable()
export class CharacterGenerator {

    public generateCharacterPack = (setName: string): CharacterPack => {
        return _.cloneDeep(this.characterPack[setName]);
    }

    private characterPack: { [id: string]: CharacterPack } = {
        testPack: testPack,
        memesPack: memesPack
    };
}

