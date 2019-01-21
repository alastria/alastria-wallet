import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParallaxLayout1 } from './parallax-layout-1';
import { ExpandableListModule } from '../expandable-list/expandable-list.module';

@NgModule({
    declarations: [
        ParallaxLayout1
    ],
    imports: [
        IonicPageModule.forChild(ParallaxLayout1),
        ExpandableListModule
    ],
    exports: [
        ParallaxLayout1
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ParallaxLayout1Module { }
