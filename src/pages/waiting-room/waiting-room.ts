import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { GameBoardPage } from '../game-board/game-board';

@Component({
    selector: 'waiting-room-page',
    templateUrl: 'waiting-room.html',
})

export class WaitingRoomPage {

    public statusMessage: string;

    public connectionFailed: Boolean;

    constructor(private _nav: NavController, private _networkingHelper: BluetoothNetworkingHelper, private _params: NavParams) {}

    ionViewDidLoad() {
        this.statusMessage = 'Connecting...';

        this._networkingHelper.connect().then((successMessage) => {
            console.log(successMessage);
            this.statusMessage = 'Succesfully connected!';
            this._nav.push(GameBoardPage, { characterPack: this._params.get('characterPack')});
        }, (errorMessage) => {
            console.log(errorMessage);
            this.statusMessage = 'Failed to connect';
            this.connectionFailed = true;
        });
    }

    public returnToMenu(): void {
        this._nav.pop();
    };
}

