import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Item } from '../../models/item.model';
import { EntityService } from '../../services/entity.service';
import { Camera } from '../tabsPage/camera/camera';

/**
 * Generated class for the EntitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entities',
  templateUrl: 'entities.html',
})
export class EntitiesPage {
  entities: Array<Item>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public entityService: EntityService) {
    this.getEntities();
  }

  async getEntities(searchItem?: string) {
    try {
      this.entities = await this.entityService.getEntities(searchItem);
    } catch (error) {
      console.error(error);
    }
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.getEntities(searchTerm);
  }

  readQr(){
    this.navCtrl.setRoot(Camera);
  }
}
