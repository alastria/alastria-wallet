import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content, ModalController } from 'ionic-angular';
import { ContructionsPage } from '../../pages/contructions/contructions';

@IonicPage()
@Component({
  selector: 'expandable-list',
  templateUrl: 'expandable-list.html'
})
export class ExpandableList {
  @Input() data: any[];
  @Input() events: any;
  @ViewChild(Content)
  content: Content;

  constructor(public modalCtrl: ModalController) {
  }

  onEvent(event: string, item: any, e: any) {
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  onStarClass(items: any, index: number, e: any) {
    for (var i = 0; i < items.length; i++) {
      items[i].isActive = i <= index;
    }
    this.onEvent("onRates", index, e);
  };

  toggleGroup(group: any) {
    group.show = !group.show;
    console.log("toggleGroup " + group.show)
  }

  isGroupShown(group: any) {
    return group.show;
  }

  navegateTo(text: string) {
    let modal = this.modalCtrl.create(ContructionsPage);

        modal.present();
        console.log('Navigating to page: ' + text);
  }
}
