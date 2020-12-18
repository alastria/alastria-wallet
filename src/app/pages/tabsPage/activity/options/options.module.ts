import { OptionsComponent } from './options';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        OptionsComponent,
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        OptionsComponent,
    ],
    exports: [
        OptionsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OptionsModule { }