import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSettings } from './user-settings';

@NgModule({
    declarations: [
        UserSettings,
    ],
    imports: [
        IonicPageModule.forChild(UserSettings)
    ],
    exports: [
        UserSettings
    ],
    entryComponents: [
        UserSettings
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserSettingsModule { }
