import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { NotificationPage } from './notification';

// Services
import { NotificationService } from '../../../services/notification.service';

// Modules
import { UserInfoHeaderModule } from 'src/app/components/user-info-header/user-info-header.module';

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
        CommonModule,
        UserInfoHeaderModule,
    ],
    exports: [
        NotificationPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class NotificationModule { }
