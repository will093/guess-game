import { Page, NavController } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { GameBoardPage } from '../game-board/game-board';
import { PlayerRole } from '../services/player-role-enum';
import { OwnPlayer } from '../services/own-player';
import { NetworkingService } from '../services/networking-service';

@Page({
  templateUrl: 'build/pages/main-menu/main-menu.html',
})

export class MainMenuPage {

  roles: typeof PlayerRole = PlayerRole;

  constructor(private nav: NavController, private ownPlayer: OwnPlayer, private networkingService: NetworkingService) {}

  onPageWillEnter(): void {
     this.networkingService.closeConnection();
  }

  startGameTapped(role: PlayerRole): void {
    this.ownPlayer.role = role;
    this.nav.push(WaitingRoomPage);
  }
}
