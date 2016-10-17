import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { OwnPlayer, OpponentPlayer, PlayerRole } from '../services/player';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';

@Component({
    templateUrl: 'build/pages/main-menu/main-menu.html',
})

export class MainMenuPage {

    roles: typeof PlayerRole = PlayerRole;

    constructor(private nav: NavController, private ownPlayer: OwnPlayer, private opponentPlayer: OpponentPlayer,
        private networkingHelper: BluetoothNetworkingHelper) {
    }

    // TODO: do this when leaving gameboard.
    ionViewWillEnter(): void {
        this.networkingHelper.closeConnection();
    }

    startGameTapped(role: PlayerRole): void {
        this.ownPlayer.role = role;
        this.opponentPlayer.role = role === PlayerRole.Host ? PlayerRole.Opponent : PlayerRole.Host;
        this.nav.push(WaitingRoomPage);
    }
}

