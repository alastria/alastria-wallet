import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { NotificationPage } from './notification';

// Services
import { NotificationService } from '../../../services/notification.service';

@NgModule({
    declarations: [
        NotificationPage,
    ],
    entryComponents: [
        NotificationPage,
    ],
    providers: [
        NotificationService
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NotificationPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class NotificationModule { }
