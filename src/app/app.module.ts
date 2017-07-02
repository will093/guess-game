import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Modal } from '../components/modal';
import { GameBoardPage } from '../pages/game-board/game-board';
import { ConfirmGuessModal } from '../pages/game-board/modals/confirm-guess-modal';
import { DataErrorModal } from '../pages/game-board/modals/data-error-modal';
import { GameOverModal } from '../pages/game-board/modals/game-over-modal';
import { ReturnToMenuModal } from '../pages/game-board/modals/return-to-menu-modal';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { BluetoothNetworkingHelper } from '../pages/services/bluetooth-networking-helper';
import { BluetoothClient } from '../pages/services/bluetooth/bluetooth-client';
import { BluetoothConfig } from '../pages/services/bluetooth/bluetooth-config';
import { BluetoothNetworkingService } from '../pages/services/bluetooth/bluetooth-networking-service';
import { BluetoothServer } from '../pages/services/bluetooth/bluetooth-server';
import { CharacterGenerator } from '../pages/services/character-generator';
import { FakeNetworkingService } from '../pages/services/fake-networking-service';
import { Game } from '../pages/services/game';
import { MessageService } from '../pages/services/message-service';
import { OpponentPlayer, OwnPlayer } from '../pages/services/player';
import { WaitingRoomPage } from '../pages/waiting-room/waiting-room';
import { MyApp } from './app.component';
import { ChoosePackPage } from '../pages/choose-pack/choose-pack';

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
    Modal,
    ChoosePackPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    Modal,
    ChoosePackPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    OwnPlayer,
    OpponentPlayer,
    Game,
    MessageService,
    { provide: BluetoothNetworkingService, useClass: FakeNetworkingService },
    BluetoothClient,
    BluetoothServer,
    BluetoothConfig,
    CharacterGenerator,
    BluetoothNetworkingHelper,
  ]
})
export class AppModule { }
