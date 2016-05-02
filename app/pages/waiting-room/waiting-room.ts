import { Page } from 'ionic-angular';
import { ConnectionService } from '../services/connection-service';

@Page({
  templateUrl: 'build/pages/waiting-room/waiting-room.html',
})

export class WaitingRoomPage {

  private statusMessage: string;

  constructor(private connectionService: ConnectionService) {
  	this.statusMessage = 'Waiting for player 2 to connect';
  	this.connectionService.initialiseConnection();
  }
}
