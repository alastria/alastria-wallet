import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollHideDirective } from './../../../components/parallax/parallax.directive';

// MODULES
import { OptionsModule } from './options/options.module';
import { UserInfoHeaderModule } from '../../../components/user-info-header/user-info-header.module';
import { ParallaxModule } from 'src/app/components/parallax/parallax.module';

// PAGES - COMPONENTS
import { ActivityPage } from './activity';

// SERVICES
import { ActivitiesService } from '../../../services/activities.service';


@NgModule({
    declarations: [
        ActivityPage,
    ],
    imports: [
        UserInfoHeaderModule,
        OptionsModule,
        CommonModule,
        ParallaxModule,
    ],
    entryComponents: [
        ActivityPage,
    ],
    exports: [
        ActivityPage
    ],
    providers: [
        ActivitiesService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class ActivityModule { }
