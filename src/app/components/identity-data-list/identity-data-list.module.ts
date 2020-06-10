import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDataListComponent } from './identity-data-list';
import { ExpandableCardComponent } from '../expandable-card/expandable-card.component';

@NgModule({
    declarations: [
        IdentityDataListComponent,
        ExpandableCardComponent
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        IdentityDataListComponent,
    ],
    exports: [
        IdentityDataListComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IdentityDataListModule { }
