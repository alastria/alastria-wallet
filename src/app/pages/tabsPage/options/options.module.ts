import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsPage } from './options';

@NgModule({
    declarations: [
        OptionsPage,
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        OptionsPage,
    ],
    exports: [
        OptionsPage
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class OptionsModule { }
