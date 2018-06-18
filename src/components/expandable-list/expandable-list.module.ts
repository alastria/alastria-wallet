import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpandableList } from './expandable-list';

@NgModule({
    declarations: [
        ExpandableList,
    ],
    imports: [
        IonicPageModule.forChild(ExpandableList),
    ],
    exports: [
        ExpandableList
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ExpandableLayout2Module { }
