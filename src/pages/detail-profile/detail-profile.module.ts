import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailProfilePage } from './detail-profile';

@NgModule({
  declarations: [
    DetailProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailProfilePage),
  ],
})
export class DetailProfilePageModule {}
