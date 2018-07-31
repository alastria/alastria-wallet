import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSettings } from './user-settings';
import { UserInfoHeaderModule } from '../../components/user-info-header/user-info-header.module';

@NgModule({
    declarations: [
        UserSettings,
    ],
    imports: [
        IonicPageModule.forChild(UserSettings),
        UserInfoHeaderModule
    ],
    exports: [
        UserSettings
    ],
    entryComponents:[
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginModule { }
