import { App, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { MainMenuPage } from './pages/main-menu/main-menu';
import { OwnPlayer } from './pages/services/own-player';
import { NetworkingService } from './pages/services/networking-service';
import { BluetoothClient } from './pages/services/bluetooth-client';
import { BluetoothServer } from './pages/services/bluetooth-server';
import { BluetoothConfig } from './pages/services/bluetooth-config';

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [OwnPlayer, NetworkingService, BluetoothClient, BluetoothServer, BluetoothConfig],
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

