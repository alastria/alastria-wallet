import { IdentityDataListComponent } from './identity-data-list';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        IdentityDataListComponent,
    ],
    imports: [
        IonicPageModule.forChild(IdentityDataListComponent),
    ],
    exports: [
        IdentityDataListComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IdentityDataListModule { }
