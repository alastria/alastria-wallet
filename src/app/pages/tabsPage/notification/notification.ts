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

  data: any = {};
  events: any = {};

  constructor(public toastCtrl: ToastService,
              private notificationService: NotificationService) {
    this.getList();
  }

  onItemClick(item: any, e: any) {
    this.toastCtrl.presentToast(item);
  }

  delete = (item: any): void => {
    let index = this.data.items.indexOf(item);
    if (index > -1) {
      this.data.items.splice(index, 1);
    }
  }

  async getList() {
    this.data = {
      title: "Avisos",
      subtitle: "Deslize cada elemento a la izquierda para ver sus opciones.",
      items: await this.notificationService.getNotifications()
    };
  }

}
