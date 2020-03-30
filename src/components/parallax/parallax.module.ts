import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Parallax } from './parallax';
import { ExpandableListModule } from '../expandable-list/expandable-list.module';

@NgModule({
    declarations: [
        Parallax
    ],
    imports: [
        IonicPageModule.forChild(Parallax),
        ExpandableListModule
    ],
    exports: [
        Parallax
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ParallaxModule { }
