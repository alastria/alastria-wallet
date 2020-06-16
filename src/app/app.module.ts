import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SecureStorage } from '@ionic-native/secure-storage';
import { HttpClientModule } from "@angular/common/http";
import { Deeplinks } from '@ionic-native/deeplinks';

// MODULES
import { TabsPageModule } from '../pages/tabsPage/tabsPage.module';
import { SuccessPageModule } from '../pages/success/success.module';
import { EntitiesPageModule } from '../pages/entities/entities.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ConfirmAccessModule } from '../pages/confirm-access/confirm-access.module';
import { LoginPageModule } from '../pages/login/login.module';

// PAGES - COMPONETS
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CredentialDetailPage } from '../pages/credential-detail/credential-detail';
import { EntitiesPage } from '../pages/entities/entities';
import { ConfirmError } from '../pages/confirmError/confirmError';

// SERVICES
import { SecuredStorageService } from '../services/securedStorage.service';
import { ToastService } from '../services/toast-service';
import { Web3Service } from '../services/web3-service';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        CredentialDetailPage,
        ConfirmError
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp, {
            backButtonText: 'Tu AlastriaID',
            backButtonIcon: 'ios-arrow-back'
        }),
        LoginPageModule,
        TabsPageModule,
        NgxQRCodeModule,
        SuccessPageModule,
        EntitiesPageModule,
        ProfilePageModule,
        ConfirmAccessModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        CredentialDetailPage,
        EntitiesPage,
        ConfirmError
    ],
    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        SecureStorage,
        Web3Service,
        SecuredStorageService,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ToastService,
        Deeplinks
    ]
})
export class AppModule { }
