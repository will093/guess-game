import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { MainMenuPage } from './pages/main-menu/main-menu';
import { OwnPlayer, OpponentPlayer } from './pages/services/player';
import { BluetoothNetworkingService } from './pages/services/bluetooth/bluetooth-networking-service';
import { FakeNetworkingService } from './pages/services/fake-networking-service';
import { BluetoothClient } from './pages/services/bluetooth/bluetooth-client';
import { BluetoothServer } from './pages/services/bluetooth/bluetooth-server';
import { BluetoothConfig } from './pages/services/bluetooth/bluetooth-config';
import { CharacterGenerator } from './pages/services/character-generator';
import { Game } from './pages/services/game';
import { MessageService } from './pages/services/message-service';
import { BluetoothNetworkingHelper } from './pages/services/bluetooth-networking-helper';

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    providers: [OwnPlayer, OpponentPlayer, Game, MessageService, { provide: BluetoothNetworkingService, useClass: FakeNetworkingService }, BluetoothClient, BluetoothServer, BluetoothConfig,
        CharacterGenerator, BluetoothNetworkingHelper],
})
export class MyApp {
    rootPage: any = MainMenuPage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }
}

ionicBootstrap(MyApp);

