import { Page, NavController } from 'ionic-angular';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { GameBoardPage } from '../game-board/game-board';

@Page({
    templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

    private statusMessage: string;

    // TODO - should this go in the constructor or somewhere else?
    constructor(private nav: NavController, private networkingHelper: BluetoothNetworkingHelper) {
        this.statusMessage = 'Connecting...';

        this.networkingHelper.connect().then((successMessage) => {
            this.statusMessage = successMessage;
            this.nav.push(GameBoardPage);
        }, (errorMessage) => {
            this.statusMessage = errorMessage;
        });
    }
}

