import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {MainMenuPage} from './pages/main-menu/main-menu';
import { OwnPlayer } from './pages/services/own-player';
import { ConnectionService } from './pages/services/connection-service';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [OwnPlayer, ConnectionService]
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
