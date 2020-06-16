import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ParallaxPage } from './parallax';
import { ExpandableListModule } from '../expandable-list/expandable-list.module';

@NgModule({
    declarations: [
        ParallaxPage
    ],
    imports: [
        ExpandableListModule
    ],
    entryComponents: [
        ParallaxPage,
    ],
    exports: [
        ParallaxPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ParallaxModule { }
