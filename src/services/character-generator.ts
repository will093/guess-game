import { Injectable } from '@angular/core';
import { cloneDeep, map } from 'lodash';

import { memesPack } from '../values/character-packs/memes';
import { testPack } from '../values/character-packs/test';
import { CharacterPack } from '../models/character-pack';

// Service for generating character sets.
@Injectable()
export class CharacterGenerator {

    public generateCharacterPack = (setName: string): CharacterPack => {
        return cloneDeep(this.characterPack[setName]);
    }

    public getAllCharacterPacks = (): CharacterPack[] => {
        return map(this.characterPack);
    }

    // dictionary of names and packs.
    private characterPack: { [id: string]: CharacterPack } = {
        'Standard': testPack,
        'Memes': memesPack
    };
}

