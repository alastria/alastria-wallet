import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// PAGES - COMPOENENTS
import { ProfilePage } from './profile';

// MODULES
import { IdentityDataListModule } from '../../components/identity-data-list/identity-data-list.module';
import { UserInfoHeaderModule } from './../../components/user-info-header/user-info-header.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    UserInfoHeaderModule,
    IdentityDataListModule
  ],
})
export class ProfilePageModule {}
