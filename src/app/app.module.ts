import { Modal } from '../components/modal';
import { MyApp } from './app.component';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { WaitingRoomPage } from '../pages/waiting-room/waiting-room';
import { GameBoardPage } from '../pages/game-board/game-board';
import { ConfirmGuessModal } from '../pages/game-board/modals/confirm-guess-modal';
import { DataErrorModal } from '../pages/game-board/modals/data-error-modal';
import { GameOverModal } from '../pages/game-board/modals/game-over-modal';
import { ReturnToMenuModal } from '../pages/game-board/modals/return-to-menu-modal';
import { ChoosePackPage } from '../pages/choose-pack/choose-pack';
import { OpponentPlayer, OwnPlayer } from '../models/player';
import { Game } from '../services/game';
import { MessageService } from '../services/message-service';
import { BluetoothNetworkingService } from '../services/bluetooth/bluetooth-networking-service';
import { FakeNetworkingService } from '../services/fake-networking-service';
import { BluetoothClient } from '../services/bluetooth/bluetooth-client';
import { BluetoothServer } from '../services/bluetooth/bluetooth-server';
import { BluetoothConfig } from '../services/bluetooth/bluetooth-config';
import { CharacterGenerator } from '../services/character-generator';
import { BluetoothNetworkingHelper } from '../services/bluetooth-networking-helper';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppMinimize } from '@ionic-native/app-minimize';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


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
    { provide: BluetoothNetworkingService, useClass: BluetoothNetworkingService },
    BluetoothClient,
    BluetoothServer,
    BluetoothConfig,
    CharacterGenerator,
    BluetoothNetworkingHelper,
    AppMinimize
  ]
})
export class AppModule { }
