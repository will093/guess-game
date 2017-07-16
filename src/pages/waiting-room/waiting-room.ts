import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { GameBoardPage } from '../game-board/game-board';
import { BluetoothNetworkingHelper } from '../../services/bluetooth-networking-helper';

@Component({
    selector: 'waiting-room-page',
    templateUrl: 'waiting-room.html',
})
export class WaitingRoomPage {

    statusMessage: string;
    loading = true;
    connectionFailed: Boolean;

    private unRegisterBackButtonAction: Function;

    constructor(
        private _nav: NavController,
        private _networkingHelper: BluetoothNetworkingHelper,
        private _params: NavParams,
        private _platform: Platform) { }

    ionViewDidLoad() {
        this.unRegisterBackButtonAction = this._platform.registerBackButtonAction(() => {}, 200);
        this.statusMessage = 'Connecting';

        this._networkingHelper.connect().then((successMessage) => {
            console.log(successMessage);
            this._nav.push(GameBoardPage, { characterPack: this._params.get('characterPack') });
            this.unRegisterBackButtonAction();
        }, (errorMessage) => {
            console.log(errorMessage);
            this.statusMessage = 'Failed to connect';
            this.connectionFailed = true;
            this.loading = false;
            this.unRegisterBackButtonAction();
        });
    }
}

