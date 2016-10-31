import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/game-board/modals/data-error-modal.html',
})
export class DataErrorModal {

    constructor(private _params: NavParams, public viewCtrl: ViewController) {}
}
