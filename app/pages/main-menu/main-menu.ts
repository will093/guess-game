import { Page, NavController } from 'ionic-angular';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { PlayerRole } from '../services/player-role-enum';
import { OwnPlayer } from '../services/own-player';
import { OpponentPlayer } from '../services/opponent-player';
import { NetworkingService } from '../services/networking-service';

@Page({
    templateUrl: 'build/pages/main-menu/main-menu.html',
})

export class MainMenuPage {

    roles: typeof PlayerRole = PlayerRole;

    constructor(private nav: NavController, private ownPlayer: OwnPlayer, private opponentPlayer: OpponentPlayer,
        private networkingService: NetworkingService) {
    }

    // TODO: do this when leaving gameboard.
    onPageWillEnter(): void {
        this.networkingService.closeConnection();
    }

    startGameTapped(role: PlayerRole): void {
        this.ownPlayer.role = role;
        this.opponentPlayer.role = role === PlayerRole.Host ? PlayerRole.Opponent : PlayerRole.Host;
        this.nav.push(WaitingRoomPage);
    }
}

