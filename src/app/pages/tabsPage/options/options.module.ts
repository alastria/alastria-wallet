import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pages
import { OptionsPage } from './options';

// Modules
import { UserInfoHeaderModule } from 'src/app/components/user-info-header/user-info-header.module';

@NgModule({
    declarations: [
        OptionsPage,
    ],
    imports: [
        CommonModule,
        UserInfoHeaderModule,
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
