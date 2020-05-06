import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDataListComponent } from './identity-data-list';

@NgModule({
    declarations: [
        IdentityDataListComponent,
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
