import { OptionsComponent } from './options';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        OptionsComponent,
    ],
    imports: [
        IonicPageModule.forChild(OptionsComponent),
    ],
    exports: [
        OptionsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OptionsModule { }