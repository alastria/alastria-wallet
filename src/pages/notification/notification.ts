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
      items: [
        {
          "id": 1,
          "title": "Grant Marshall",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/17.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 2,
          "title": "Pena Valdez",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/18.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 3,
          "title": "Jessica Miles",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/19.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 4,
          "title": "Kerri Barber",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/20.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 5,
          "title": "Natasha Gamble",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/21.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 6,
          "title": "White Castaneda",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/22.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 7,
          "title": "Vanessa Ryan",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/11.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 8,
          "title": "Carol Kelly",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/17.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
        },
        {
          "id": 9,
          "title": "Barrera Ramsey",
          "subtitle": "Lorem ipsum dolor sit amet, consectetur",
          "image": "assets/images/avatar/18.jpg",
          "ionBadge": "follow",
          "delate": "Delete"
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
