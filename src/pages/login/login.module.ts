import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  providers: [
    FingerprintAIO
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
