import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'return-to-menu-modal',
    templateUrl: 'return-to-menu-modal.html',
})
export class ReturnToMenuModal {

    constructor(public viewCtrl: ViewController) {}
}
