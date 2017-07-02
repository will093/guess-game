import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { ChoosePackPage } from '../choose-pack/choose-pack';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { OpponentPlayer, OwnPlayer, PlayerRole } from '../services/player';
import { WaitingRoomPage } from '../waiting-room/waiting-room';

@Component({
    selector: 'main-menu-page',
    templateUrl: 'main-menu.html',
})

export class MainMenuPage {

    constructor(private _nav: NavController, private _ownPlayer: OwnPlayer, private _opponentPlayer: OpponentPlayer,
        private _networkingHelper: BluetoothNetworkingHelper, private _modalCtrl: ModalController) {}

    // TODO: do this when leaving gameboard.
    ionViewWillEnter(): void {
        this._networkingHelper.closeConnection();
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
