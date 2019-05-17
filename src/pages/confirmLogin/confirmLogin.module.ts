import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmLogin } from './confirmLogin';

@NgModule({
  declarations: [
    ConfirmLogin,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmLogin),
  ],
})
export class ConfirmLoginModule {}
