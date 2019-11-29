import { Component } from '@angular/core';
import { Platform, App, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { IdentityService } from '../services/identity-service';
import { Web3Service } from '../services/web3-service';
import { TransactionService } from '../services/transaction-service';
import { AppConfig } from "../app.config";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, app: App, web3Srv: Web3Service, identitySrv: IdentityService,  transactionSrv: TransactionService) {
        console.log("[Debug] App enter");
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is('android')) {
                statusBar.backgroundColorByHexString('#325b8e');
            }
            splashScreen.hide();
            let web3 = web3Srv.getWeb3();
            console.log("AppConfig "  + JSON.stringify(AppConfig.credentialKey));
            let credentialSubject = {};
            credentialSubject[AppConfig.credentialKey] = AppConfig.credentialValue;
            credentialSubject["levelOfAssurance"]="basic";
            let serT = new TransactionService(web3Srv, identitySrv);
            serT.addSubjectCredential(AppConfig.kidCredential, AppConfig.didIsssuer, AppConfig.subjectAlastriaID, AppConfig.context, credentialSubject, AppConfig.tokenExpTime, AppConfig.tokenActivationDate, AppConfig.jti, AppConfig.uri).then(result =>  console.log("The final result is " + JSON.stringify(result)));
            //transactionSrv.getSubjectCredentialList(AppConfig.subject);
        });
    }
}

