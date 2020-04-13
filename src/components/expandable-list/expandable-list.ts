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

  navegateTo(text: string): void {
    let modal = this.modalCtrl.create(ContructionsPage);
    modal.present();
  }
}
