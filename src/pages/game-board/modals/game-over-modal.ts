import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'game-over-modal',
    templateUrl: 'game-over-modal.html',
})
export class GameOverModal {

    public gameOverVictory: Boolean;

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}

    ionViewDidLoad() {
        this.gameOverVictory = this._params.get('gameOverVictory');
    }
}
