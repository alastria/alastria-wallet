import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmError } from './confirmError';

@NgModule({
  declarations: [
    ConfirmError,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmError),
  ],
})
export class ConfirmErrorModule {}
