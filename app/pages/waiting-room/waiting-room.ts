import { Page } from 'ionic-angular';
import { NetworkingService } from '../services/networking-service';

@Page({
  templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

  private statusMessage: string;

  constructor(private networkingService: NetworkingService) {
    this.statusMessage = 'Connecting...';
    this.networkingService.connect().then((successMessage) => {
        this.statusMessage = successMessage;
    }, (errorMessage) => {
        this.statusMessage = errorMessage;
    });
  }
}

