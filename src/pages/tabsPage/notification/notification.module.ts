import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { Notification } from './notification';

// Services
import { NotificationService } from '../../../services/notification.service';

@NgModule({
    declarations: [
        Notification,
    ],
    imports: [
        IonicPageModule.forChild(Notification),
    ],
    providers: [
        NotificationService
    ],
    exports:[
        Notification
    ]
})

export class NotificationModule { }
