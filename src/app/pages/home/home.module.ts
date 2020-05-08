import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePageRoutingModule } from 'src/app/pages/home/home-routing.module';
import { HomePage } from './home.page';
import { LoginPageModule } from '../login/login.module';
import { EntitiesPageModule } from '../entities/entities.module';
import { ProfilePageModule } from '../profile/profile.module';
import { UserSettingsModule } from 'src/app/components/user-info-header/userSettings/user-settings.module';
import { CameraModule } from '../tabsPage/camera/camera.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LoginPageModule,
    EntitiesPageModule,
    ProfilePageModule,
    UserSettingsModule,
    CameraModule
  ],
  declarations: [
    HomePage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
