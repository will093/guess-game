import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { WaitingRoomPage } from '../pages/waiting-room/waiting-room';
import { GameBoardPage } from '../pages/game-board/game-board';
import { ConfirmGuessModal } from '../pages/game-board/modals/confirm-guess-modal';
import { DataErrorModal } from '../pages/game-board/modals/data-error-modal';
import { GameOverModal } from '../pages/game-board/modals/game-over-modal';
import { ReturnToMenuModal } from '../pages/game-board/modals/return-to-menu-modal';
import { OwnPlayer, OpponentPlayer } from '../pages/services/player';
import { BluetoothNetworkingService } from '../pages/services/bluetooth/bluetooth-networking-service';
import { FakeNetworkingService } from '../pages/services/fake-networking-service';
import { BluetoothClient } from '../pages/services/bluetooth/bluetooth-client';
import { BluetoothServer } from '../pages/services/bluetooth/bluetooth-server';
import { BluetoothConfig } from '../pages/services/bluetooth/bluetooth-config';
import { CharacterGenerator } from '../pages/services/character-generator';
import { Game } from '../pages/services/game';
import { MessageService } from '../pages/services/message-service';
import { BluetoothNetworkingHelper } from '../pages/services/bluetooth-networking-helper';

@NgModule({
    declarations: [
        MyApp,
        MainMenuPage,
        WaitingRoomPage,
        GameBoardPage,
        ConfirmGuessModal,
        DataErrorModal,
        GameOverModal,
        ReturnToMenuModal,
    ],
    imports: [
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MainMenuPage,
        WaitingRoomPage,
        GameBoardPage,
        ConfirmGuessModal,
        DataErrorModal,
        GameOverModal,
        ReturnToMenuModal,
    ],
    providers: [
        MyApp,
        OwnPlayer,
        OpponentPlayer,
        Game,
        MessageService,
        { provide: BluetoothNetworkingService, useClass: BluetoothNetworkingService },
        BluetoothClient,
        BluetoothServer,
        BluetoothConfig,
        CharacterGenerator,
        BluetoothNetworkingHelper,
    ],
})
export class AppModule {}
