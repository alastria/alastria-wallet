import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// PAGES - COMPOENENTS
import { ProfilePage } from './profile';

// MODULES
import { IdentityDataListModule } from '../../components/identity-data-list/identity-data-list.module';
import { UserInfoHeaderModule } from '../../components/user-info-header/user-info-header.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    CommonModule,
    UserInfoHeaderModule,
    IdentityDataListModule
  ],
  entryComponents: [
    ProfilePage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfilePageModule {}
