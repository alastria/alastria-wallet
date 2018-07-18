import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Notification } from './notification';

@NgModule({
    declarations: [
        Notification,
    ],
    imports: [
        IonicPageModule.forChild(Notification),
    ],
    exports:[
        Notification
    ]
})

export class NotificationModule { }
