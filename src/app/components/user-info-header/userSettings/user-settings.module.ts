import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserSettingsPage } from './user-settings';

@NgModule({
    declarations: [
        UserSettingsPage,
    ],
    exports: [
        UserSettingsPage
    ],
    entryComponents: [
        UserSettingsPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserSettingsModule { }
