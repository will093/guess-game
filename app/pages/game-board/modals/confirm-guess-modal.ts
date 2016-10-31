import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/game-board/modals/confirm-guess-modal.html',
})
export class ConfirmGuessModal {

    public character: Boolean;

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}

    ionViewLoaded() {
        this.character = this._params.get('character');
    }
}
