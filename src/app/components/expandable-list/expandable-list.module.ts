import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableListComponent } from './expandable-list';

@NgModule({
    declarations: [
        ExpandableListComponent,
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        ExpandableListComponent,
    ],
    exports: [
        ExpandableListComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ExpandableListModule { }
