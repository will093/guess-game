import { Component } from '@angular/core';
import { AppMinimize } from '@ionic-native/app-minimize';
import { NavController, Platform } from 'ionic-angular';

import { OpponentPlayer, OwnPlayer, PlayerRole } from '../../models/player';
import { BluetoothNetworkingHelper } from '../../services/bluetooth-networking-helper';
import { ChoosePackPage } from '../choose-pack/choose-pack';
import { WaitingRoomPage } from '../waiting-room/waiting-room';

@Component({
    selector: 'main-menu-page',
    templateUrl: 'main-menu.html',
})

export class MainMenuPage {

    private unRegisterBackButtonAction: Function;

    constructor(
        private _nav: NavController,
        private _ownPlayer: OwnPlayer,
        private _opponentPlayer: OpponentPlayer,
        private _networkingHelper: BluetoothNetworkingHelper,
        private _appMinimize: AppMinimize,
        private _platform: Platform) { }

    // TODO: do this when leaving gameboard.
    ionViewWillEnter(): void {
        this._networkingHelper.closeConnection();
        this.unRegisterBackButtonAction = this._platform.registerBackButtonAction(() => {
            this._appMinimize.minimize().then(() => { this.unRegisterBackButtonAction() });
        }, 200);
    }

    ionViewWillLeave(): void {
        this.unRegisterBackButtonAction();
    }

    public hostGameTapped(): void {
        this._ownPlayer.role = PlayerRole.Host;
        this._opponentPlayer.role = PlayerRole.Opponent;
        this._nav.push(ChoosePackPage);
    }

    public joinGameTapped(): void {
        this._ownPlayer.role = PlayerRole.Opponent;
        this._opponentPlayer.role = PlayerRole.Host;
        this._nav.push(WaitingRoomPage);
    }


}
