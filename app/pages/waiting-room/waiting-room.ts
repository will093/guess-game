import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { GameBoardPage } from '../game-board/game-board';
import { MainMenuPage } from '../main-menu/main-menu';

@Component({
    templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

    statusMessage: string;

    constructor(private nav: NavController, private networkingHelper: BluetoothNetworkingHelper) {}

    ionViewLoaded() {
        this.statusMessage = 'Connecting...';

        this.networkingHelper.connect().then((successMessage) => {
            console.log(successMessage);
            this.statusMessage = 'Succesfully connected!';
            this.nav.push(GameBoardPage);
        }, (errorMessage) => {
            console.log(errorMessage);
            this.statusMessage = 'Failed to connect';
        });
    }

    returnToMenu(): void {
        this.nav.pop();
    };
}

