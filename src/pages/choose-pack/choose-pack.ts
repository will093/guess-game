import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CharacterPack } from '../../models/character-pack';
import { CharacterGenerator } from '../../services/character-generator';
import { WaitingRoomPage } from '../waiting-room/waiting-room';

@Component({
    selector: 'choose-pack-page',
    templateUrl: 'choose-pack.html',
})

export class ChoosePackPage {

    characterPacks: CharacterPack[];

    constructor(private _nav: NavController, private _characterGenerator: CharacterGenerator) { }

    ionViewWillEnter(): void {
        this.characterPacks = this._characterGenerator.getAllCharacterPacks();
    }

    packSelected(pack) {
        this._nav.push(WaitingRoomPage, { characterPack: pack.name });
    }
}
