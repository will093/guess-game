import { Page, NavController, Storage, LocalStorage } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { GameBoardPage } from '../game-board/game-board';
import { PlayerRole } from '../services/player-role-enum'

@Page({
  templateUrl: 'build/pages/main-menu/main-menu.html',
})

export class MainMenuPage {

  storage: Storage = new Storage(LocalStorage, 'guess');
  roles: typeof PlayerRole = PlayerRole;

  constructor(private nav: NavController) {
      this.nav = nav;
  }

  startGameTapped(role: PlayerRole) {
      this.storage.set('ownRole', role);
      this.nav.push(WaitingRoomPage);
  }
}
