import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/game-board/modals/data-error-modal.html',
})
export class DataErrorModal {

    constructor(public viewCtrl: ViewController) {}
}
