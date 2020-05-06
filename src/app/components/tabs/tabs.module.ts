import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// PAGES - COMPONENTS
import { TabsComponent } from './tabs';

// SERVICES
import { MessageManagerService } from '../../services/messageManager-service';
import { TokenService } from '../../services/token-service';
@NgModule({
    declarations: [
        TabsComponent
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        TabsComponent,
    ],
    exports: [
        TabsComponent
    ],
    providers: [
        MessageManagerService,
        TokenService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsModule { }
