import { IdentityDataListModule } from './../components/identity-data-list/identity-data-list.module';
import { Activities } from './../services/activities/activities.service';
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
import { SessionSecuredStorageService, IdentitySecuredStorageService } from '../services/securedStorage.service';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { ConfirmLogin } from '../pages/confirmLogin/confirmLogin';
import { TermsConditionsPageModule } from '../pages/terms-conditions/terms-conditions.module';
import { ConfirmAccess } from '../pages/confirm-access/confirm-access';
import { SelectIdentity } from './../pages/confirm-access/select-identity/select-identity';
import { HttpClientModule } from "@angular/common/http"
import { TokenService } from '../services/token-service';
import { ToastService } from '../services/toast-service';

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
        ConfirmLogin,
        WalkthroughPage,
        ConfirmAccess,
        SelectIdentity
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
        TermsConditionsPageModule,
        SuccessPageModule,
        UserInfoHeaderModule,
        IdentityDataListModule,
        UserInfoHeaderModule,
        HttpClientModule
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
        ConfirmAccess,
        WalkthroughPage,
        ConfirmLogin,
        SelectIdentity
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LoadingService,
        BarcodeScanner,
        FingerprintAIO,
        SecureStorage,
        SessionSecuredStorageService,
        IdentitySecuredStorageService,
        Activities,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ToastService,
        TokenService
    ]
})
export class AppModule { }
