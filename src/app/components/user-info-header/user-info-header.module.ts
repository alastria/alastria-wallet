import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserInfoHeaderComponent } from './user-info-header';
import { UserSettingsModule } from './userSettings/user-settings.module';

@NgModule({
    declarations: [
        UserInfoHeaderComponent,
    ],
    imports: [
        UserSettingsModule
    ],
    entryComponents: [
        UserInfoHeaderComponent
    ],
    exports: [
        UserInfoHeaderComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserInfoHeaderModule { }
