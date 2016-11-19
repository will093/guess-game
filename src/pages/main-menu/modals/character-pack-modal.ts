import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'character-pack-modal',
    templateUrl: 'character-pack-modal.html',
})
export class CharacterPackModal {

    constructor(public viewCtrl: ViewController) {}
}
