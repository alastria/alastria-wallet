import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { IdentityService } from '../services/identity-service';
import { Web3Service } from '../services/web3-service';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, app: App, web3Srv: Web3Service, identitySrv: IdentityService) {
        console.log("[Debug] App enter");
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is('android')) {
                statusBar.backgroundColorByHexString('#325b8e');
            }
            splashScreen.hide();
            web3Srv.init().subscribe(() => {
                let web3 = web3Srv.getWeb3();
                identitySrv.init(web3);
            });
        });
    }
}

