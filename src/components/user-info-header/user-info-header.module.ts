import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoHeader } from './user-info-header';

@NgModule({
    declarations: [
        UserInfoHeader,
    ],
    imports: [
        IonicPageModule.forChild(UserInfoHeader),
    ],
    exports: [
        UserInfoHeader
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserInfoHeaderModule { }
