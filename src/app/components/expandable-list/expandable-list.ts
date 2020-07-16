import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConstructionsPage } from '../../pages/constructions/constructions';

@Component({
  selector: 'expandable-list',
  templateUrl: 'expandable-list.html',
  styleUrls: ['/expandable-list.scss']
})
export class ExpandableListComponent {
  @Input() data: any[];
  @Input() events: any;

  constructor(public modalCtrl: ModalController) {
  }

  async navegateTo(text: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ConstructionsPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
}
