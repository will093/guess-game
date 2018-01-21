import { Injectable } from '@angular/core';
import { cloneDeep, map } from 'lodash';

import { CharacterPack } from '../models/character-pack';
import { animalsPack } from '../values/character-packs/animals';
import { standardPack } from '../values/character-packs/standard';

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
        'Standard': standardPack,
        'Animals': animalsPack
    };
}

