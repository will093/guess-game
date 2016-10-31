import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/game-board/modals/game-over-modal.html',
})
export class GameOverModal {

    public gameOverVictory: Boolean;

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}

    ionViewLoaded() {
        this.gameOverVictory = this._params.get('gameOverVictory');
    }
}
