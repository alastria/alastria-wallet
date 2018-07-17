import { Component } from '@angular/core';
import { IonicPage, ItemSliding } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';

@IonicPage()
@Component({
  templateUrl: 'notification.html',
  providers: [TabsService, ToastService]
})
export class Notification {

  data: any = {};
  events: any = {};

  constructor() {
    this.getList();
  }

  onEvent(event: string, item: any, e: any) {
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  undo = (slidingItem: ItemSliding) => {
    slidingItem.close();
  }

  delete = (item: any): void => {
    let index = this.data.items.indexOf(item);
    if (index > -1) {
      this.data.items.splice(index, 1);
    }
  }

  getList() {
    this.data = {
      title: "Avisos",
      subtitle: "Deslize cada elemento a la izquierda para ver sus opciones.",
      items: [
        {
          "id": 1,
          "title": "Samelan",
          "subtitle": "Solicita acceso a 1 dato",
          "image": "assets/images/logo/logo-samelan.jpg",
          "ionBadge": "follow",
          "accept": "Aceptar",
          "delete": "Borrar"
        },
        {
          "id": 2,
          "title": "Univ. de Barcelona",
          "subtitle": "Solicita acceso a 3 datos",
          "image": "assets/images/logo/logo-univ.jpg",
          "ionBadge": "follow",
          "accept": "Aceptar",
          "delete": "Borrar"
        },
        {
          "id": 3,
          "title": "Univ. de Barcelona",
          "subtitle": "Solicita acceso a 1 dato",
          "image": "assets/images/logo/logo-univ.jpg",
          "ionBadge": "follow",
          "accept": "Aceptar",
          "delete": "Borrar"
        }
      ]
    }

    this.events = {
      'onItemClick': function (item: any) {
        this.toastCtrl.presentToast(item);
      },
      'onDelete': function (item: any) {
        this.toastCtrl.presentToast("Delete " + item.title);
      },
      'onButtonGetClick': function (item: any) {
        this.toastCtrl.presentToast("Like");
      }
    };
  }

}
