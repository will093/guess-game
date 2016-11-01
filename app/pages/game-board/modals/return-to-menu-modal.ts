import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/game-board/modals/return-to-menu-modal.html',
})
export class ReturnToMenuModal {

    constructor(public viewCtrl: ViewController) {}
}
