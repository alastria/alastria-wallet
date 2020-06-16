import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// MODULES
import { TabsPageModule } from './pages/tabsPage/tabsPage.module';
import { SuccessPageModule } from './pages/success/success.module';
import { ConfirmAccessModule } from './pages/confirm-access/confirm-access.module';
import { LoginPageModule } from './pages/login/login.module';
import { EntitiesPageModule } from './pages/entities/entities.module';
import { UserSettingsModule } from './components/user-info-header/userSettings/user-settings.module';
import { CameraModule } from './pages/tabsPage/camera/camera.module';
import { ProfilePageModule } from './pages/profile/profile.module';

// PAGES - COMPONETS
import { CredentialDetailPage } from './pages/credential-detail/credential-detail';
import { ConfirmErrorPage } from './pages/confirmError/confirmError';

// SERVICES
import { ToastService } from './services/toast-service';
import { Web3Service } from './services/web3-service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';

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
        TabsPageModule,
        NgxQRCodeModule,
        SuccessPageModule,
        ConfirmAccessModule,
        LoginPageModule,
        EntitiesPageModule,
        ProfilePageModule,
        UserSettingsModule,
        CameraModule
    ],
    bootstrap: [AppComponent],
    entryComponents: [
      AppComponent,
      CredentialDetailPage,
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
      ToastService,
      AuthGuardService,
      AuthenticationService
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }
