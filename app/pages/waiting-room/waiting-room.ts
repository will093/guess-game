import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { GameBoardPage } from '../game-board/game-board';
import { MainMenuPage } from '../main-menu/main-menu';

@Component({
    templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

    public statusMessage: string;

    constructor(private _nav: NavController, private _networkingHelper: BluetoothNetworkingHelper) {}

    ionViewLoaded() {
        this.statusMessage = 'Connecting...';

        this._networkingHelper.connect().then((successMessage) => {
            console.log(successMessage);
            this.statusMessage = 'Succesfully connected!';
            this._nav.push(GameBoardPage);
        }, (errorMessage) => {
            console.log(errorMessage);
            this.statusMessage = 'Failed to connect';
        });
    }

    public returnToMenu(): void {
        this._nav.pop();
    };
}

