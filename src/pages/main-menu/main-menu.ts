import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { OwnPlayer, OpponentPlayer, PlayerRole } from '../services/player';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';

@Component({
    selector: 'main-menu-page',
    templateUrl: 'main-menu.html',
})

export class MainMenuPage {

    public roles: typeof PlayerRole = PlayerRole;

    constructor(private _nav: NavController, private _ownPlayer: OwnPlayer, private _opponentPlayer: OpponentPlayer,
        private _networkingHelper: BluetoothNetworkingHelper) {
    }

    // TODO: do this when leaving gameboard.
    ionViewWillEnter(): void {
        this._networkingHelper.closeConnection();
    }

    public startGameTapped(role: PlayerRole): void {
        this._ownPlayer.role = role;
        this._opponentPlayer.role = role === PlayerRole.Host ? PlayerRole.Opponent : PlayerRole.Host;
        this._nav.push(WaitingRoomPage);
    }
}

