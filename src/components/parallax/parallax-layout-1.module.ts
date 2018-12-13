import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParallaxLayout1 } from './parallax-layout-1';
import { ExpandableListModule } from '../expandable-list/expandable-list.module';
import { UserInfoHeaderModule } from '../user-info-header/user-info-header.module';
import { ScrollHideDirective } from './parallax.directive';

@NgModule({
    declarations: [
        ParallaxLayout1,
        ScrollHideDirective
    ],
    imports: [
        IonicPageModule.forChild(ParallaxLayout1),
        ExpandableListModule,
        UserInfoHeaderModule
    ],
    exports: [
        ParallaxLayout1
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ParallaxLayout1Module { }
