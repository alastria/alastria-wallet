import { UserInfoHeaderModule } from './../../../components/user-info-header/user-info-header.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Activity } from './activity'
import { OptionsModule } from './options/options.module';


@NgModule({
    declarations: [
        Activity,
    ],
    imports: [
        IonicPageModule.forChild(Activity),
        UserInfoHeaderModule,
        OptionsModule
    ],
    exports:[
        Activity
    ]
})

export class ActivityModule { }
