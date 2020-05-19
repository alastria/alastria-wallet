import { Component } from '@angular/core';

// Services
import { ToastService } from '../../../services/toast-service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  templateUrl: 'notification.html',
  providers: [ToastService],
  styleUrls: ['/notification.scss']
})
export class NotificationPage {

  notifications: any = {};
  events: any = {};

  constructor(public toastCtrl: ToastService,
              private notificationService: NotificationService) {
    this.getList();
  }

  onItemClick(item: any, e: any) {
    this.toastCtrl.presentToast(item);
  }

  delete = (notification: any): void => {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  async getList() {
    this.notifications = await this.notificationService.getNotifications();
  }

}
