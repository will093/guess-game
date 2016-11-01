import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'confirm-guess-modal',
    templateUrl: 'confirm-guess-modal.html',
})
export class ConfirmGuessModal {

    public character: Boolean;

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}

    ionViewDidLoad() {
        this.character = this._params.get('character');
    }
}