import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// MODULES
import { OptionsModule } from './options/options.module';
import { UserInfoHeaderModule } from './../../../components/user-info-header/user-info-header.module';

// PAGES - COMPONENTS
import { Activity } from './activity'

// SERVICES
import { ActivitiesService } from '../../../services/activities.service';


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
    ],
    providers: [
        ActivitiesService
    ]
})

export class ActivityModule { }
