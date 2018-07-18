import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { LoadingService } from '../services/loading-service';
import { TabsModule } from '../components/tabs/tabs.module';
import { QRScanner } from '@ionic-native/qr-scanner'
import { TabsPage } from '../pages/tabsPage/tabsPage';
import { RegisterHub } from '../pages/register/register-hub/register-hub';
import { RegisterFormModule } from '../pages/register/register-hub/register-form/register-form.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    Login,
    RegisterHub
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    TabsModule,
    RegisterFormModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    Login,
    RegisterHub
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoadingService,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
