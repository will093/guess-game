import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MainMenuPage } from '../pages/main-menu/main-menu';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = MainMenuPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();

      setTimeout(() => {
        splashScreen.hide();
      }, 1000);

      // Disablehardware back button.
      platform.registerBackButtonAction(() => {
        return;
      }, 100);
    });
  }
}
