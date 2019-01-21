import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoHeader } from './user-info-header';
import { UserSettingsModule } from './userSettings/user-settings.module';

@NgModule({
    declarations: [
        UserInfoHeader,
    ],
    imports: [
        IonicPageModule.forChild(UserInfoHeader),
        UserSettingsModule
    ],
    exports: [
        UserInfoHeader
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserInfoHeaderModule { }
