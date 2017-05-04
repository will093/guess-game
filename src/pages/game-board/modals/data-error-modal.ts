import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'data-error-modal',
    templateUrl: 'data-error-modal.html',
})
export class DataErrorModal {

    constructor(public viewCtrl: ViewController) {}
}
