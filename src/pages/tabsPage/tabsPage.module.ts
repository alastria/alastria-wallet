import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabsPage';
import { TabsModule } from '../../components/tabs/tabs.module';

@NgModule({
    declarations: [
        TabsPage
    ],
    imports: [
        IonicPageModule.forChild(TabsPage),
        TabsModule
    ],
    exports: [
        TabsPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsPageModule { }
