import { Page, NavController } from 'ionic-angular';
import { BluetoothNetworkingService } from '../services/bluetooth/bluetooth-networking-service';
import { GameBoardPage } from '../game-board/game-board';

@Page({
    templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

    private statusMessage: string;

    constructor(private nav: NavController, private networkingService: BluetoothNetworkingService) {
        this.statusMessage = 'Connecting...';
        this.networkingService.connect().then((successMessage) => {
            this.statusMessage = successMessage;
            this.nav.push(GameBoardPage);
        }, (errorMessage) => {
            this.statusMessage = errorMessage;
        });
    }
}

