import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController, ViewController } from 'ionic-angular';
import { MainMenuPage } from '../../main-menu/main-menu';

@Component({
    templateUrl: 'build/pages/game-board/modals/game-over-modal.html',
})
export class GameOverModal {

    public gameOverVictory: Boolean;

    constructor(private _params: NavParams, private _nav: NavController, private _viewCtrl: ViewController) {}

    ionViewLoaded() {
        this.gameOverVictory = this._params.get('gameOverVictory');
    }

    public dismiss = (): void => {
        this._viewCtrl.dismiss();
    }
}
