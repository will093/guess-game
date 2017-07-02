import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CharacterGenerator } from '../services/character-generator';
import { CharacterPack } from '../services/character-pack';
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

    onPackSelected(pack) {
        this._nav.push(WaitingRoomPage, { characterPack: pack.name });
    }

    onBackArrowPressed() {
        this._nav.pop();
    }
}
