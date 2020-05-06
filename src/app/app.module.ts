import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

// MODULES
import { TabsPageModule } from './pages/tabsPage/tabsPage.module';
import { SuccessPageModule } from './pages/success/success.module';
import { EntitiesPageModule } from './pages/entities/entities.module';
import { ProfilePageModule } from './pages/profile/profile.module';
import { ConfirmAccessModule } from './pages/confirm-access/confirm-access.module';
import { LoginPageModule } from './pages/login/login.module';
import { HomePageModule } from './pages/home/home.module';

// PAGES - COMPONETS
import { CredentialDetailPage } from './pages/credential-detail/credential-detail';
import { EntitiesPage } from './pages/entities/entities';
import { ConfirmErrorPage } from './pages/confirmError/confirmError';

// SERVICES
import { SecuredStorageService } from './services/securedStorage.service';
import { ToastService } from './services/toast-service';
import { Web3Service } from './services/web3-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
    declarations: [
      AppComponent,
      CredentialDetailPage,
      ConfirmErrorPage
    ],
    imports: [
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        HomePageModule,
        LoginPageModule,
        TabsPageModule,
        NgxQRCodeModule,
        SuccessPageModule,
        EntitiesPageModule,
        ProfilePageModule,
        ConfirmAccessModule
    ],
    bootstrap: [AppComponent],
    entryComponents: [
      AppComponent,
      CredentialDetailPage,
      EntitiesPage,
      ConfirmErrorPage
    ],
    providers: [
      BarcodeScanner,
      Deeplinks,
      SecureStorage,
      Web3Service,
      SplashScreen,
      StatusBar,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      ToastService
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }
