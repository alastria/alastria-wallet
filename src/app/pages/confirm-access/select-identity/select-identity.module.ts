import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// PAGES - COMPONENTS
import { SelectIdentityPage } from './select-identity';

// MODULES
import { IdentityDataListModule } from '../../../components/identity-data-list/identity-data-list.module';

@NgModule({
    declarations: [SelectIdentityPage],
    imports: [
        CommonModule,
        IdentityDataListModule
    ],
    entryComponents: [
        SelectIdentityPage,
    ],
    exports: [
        SelectIdentityPage,
        IdentityDataListModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class SelectIdentityModule {}
