import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CredentialDetailPage } from './credential-detail';

@NgModule({
  declarations: [
    CredentialDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CredentialDetailPage),
  ],
})
export class DetailProfilePageModule {}
