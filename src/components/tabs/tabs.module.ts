import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tabs } from './tabs';

@NgModule({
    declarations: [
        Tabs
    ],
    imports: [
        IonicPageModule.forChild(Tabs)
    ],
    exports: [
        Tabs
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsModule { }
