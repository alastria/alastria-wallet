import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Login, InfoPage } from '../pages/login/login';
import { LoadingService } from '../services/loading-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { RegisterHub } from '../pages/register/register-hub/register-hub';
import { RegisterFormModule } from '../pages/register/register-hub/register-form/register-form.module';
import { TabsPageModule } from '../pages/tabsPage/tabsPage.module';
import { UserInfoHeaderModule } from '../components/user-info-header/user-info-header.module';
import { SecureStorage } from '@ionic-native/secure-storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { ContructionsPageModule } from './../pages/contructions/contructions.module'
import { SuccessPageModule } from '../pages/success/success.module';
import { ProfilePage } from '../pages/profile/profile';
import { DetailProfilePage } from '../pages/detail-profile/detail-profile';
import { AlastriaPublicKeyRegistryService } from '../services/alastriaPublicKeyRegistry.service';
import { SessionSecuredStorageService, IdentitySecuredStorageService } from '../services/securedStorage.service';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { TermsConditionsPage } from '../pages/terms-conditions/terms-conditions';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        Login,
        InfoPage,
        ProfilePage,
        DetailProfilePage,
        RegisterHub,
        WalkthroughPage,
        TermsConditionsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
            backButtonText: 'Tu AlastriaID',
            backButtonIcon: 'ios-arrow-back'
        }
        ),
        RegisterFormModule,
        TabsPageModule,
        NgxQRCodeModule,
        ContructionsPageModule,
        SuccessPageModule,
        UserInfoHeaderModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        Login,
        InfoPage,
        ProfilePage,
        DetailProfilePage,
        RegisterHub,
        WalkthroughPage,
        TermsConditionsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LoadingService,
        BarcodeScanner,
        FingerprintAIO,
        SecureStorage,
        AlastriaPublicKeyRegistryService,
        SessionSecuredStorageService,
        IdentitySecuredStorageService,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
