import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { OwnPlayer, OpponentPlayer, PlayerRole } from '../services/player';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { CharacterPackModal } from './modals/character-pack-modal';

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

        let characterPackModal = this._modalCtrl.create(CharacterPackModal);

        characterPackModal.onDidDismiss(characterPack => {
            if (characterPack) {
                this._nav.push(WaitingRoomPage, { characterPack: characterPack });
            }
        });

        characterPackModal.present();
    }

    public joinGameTapped(): void {
        this._ownPlayer.role = PlayerRole.Opponent;
        this._opponentPlayer.role = PlayerRole.Host;
        this._nav.push(WaitingRoomPage);
    }
}
