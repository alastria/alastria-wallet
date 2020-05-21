import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages - Components
import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (this.platform.is('android')) {
               this.statusBar.backgroundColorByHexString('#325b8e');
            }
            this.splashScreen.hide();
        });
    }

}

