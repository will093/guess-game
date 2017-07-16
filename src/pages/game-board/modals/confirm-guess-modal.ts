import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Character } from '../../../models/character';

@Component({
    selector: 'confirm-guess-modal',
    templateUrl: 'confirm-guess-modal.html',
})
export class ConfirmGuessModal {

    public character: Character;

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}

    ionViewDidLoad() {
        this.character = this._params.get('character');
    }
}
