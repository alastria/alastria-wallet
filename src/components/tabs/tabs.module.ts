import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// PAGES - COMPONENTS
import { Tabs } from './tabs';

// SERVICES
import { MessageManagerService } from './../../services/messageManager-service';
import { TokenService } from './../../services/token-service';
@NgModule({
    declarations: [
        Tabs
    ],
    imports: [
        IonicPageModule.forChild(Tabs),
    ],
    exports: [
        Tabs
    ],
    providers: [
        MessageManagerService,
        TokenService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsModule { }
