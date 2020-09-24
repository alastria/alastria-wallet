import { Component } from '@angular/core';

// Services
import { ToastService } from '../../../services/toast-service';
import { NotificationService } from '../../../services/notification.service';
import { Observable } from 'rxjs';
import { share, map } from 'rxjs/operators';

// Models
import { NotificationModel } from 'src/app/models/notification.model';

@Component({
  templateUrl: 'notification.html',
  providers: [ToastService],
  styleUrls: ['/notification.scss']
})
export class NotificationPage {

  notifications: Observable<Array<NotificationModel>>;
  events: any = {};

  constructor(public toastCtrl: ToastService,
              private notificationService: NotificationService) {
    this.notifications = this.getNotifications().pipe(share());
  }
  onItemClick(item: any, e: any) {
    this.toastCtrl.presentToast(item);
  }

  delete = (notification: any): void => {
    this.notifications = this.notifications.pipe(map(notifications => {
      const index = notifications.indexOf(notification);
      if (index > -1) {
        notifications.splice(index, 1);
      }
      return notifications;
    }));
  }

  getNotifications(): Observable<Array<NotificationModel>> {
    return this.notificationService.getNotifications();
  }

}
