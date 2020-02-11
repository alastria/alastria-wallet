import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';


// Models
import { Item } from '../../models/item.model';

//Services
import { EntityService } from '../../services/entity.service';

// Pages
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
  url: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public entityService: EntityService,
              private sanitize: DomSanitizer,
              private inAppBrowser: InAppBrowser) {
    this.getEntities();
  }

  async getEntities(searchItem?: string) {
    try {
      this.entities = await this.entityService.getEntities(searchItem);
    } catch (error) {
      console.error(error);
    }
  }

  urlpaste(){
    this.url = 'https://34.244.47.233';
    return this.sanitize.bypassSecurityTrustResourceUrl(this.url);
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.getEntities(searchTerm);
  }

  readQr(){
    this.navCtrl.setRoot(Camera);
  }

  openBlank(item: Item) {
    if (item.entityUrl) {
      const externalWeb = this.inAppBrowser.create(item.entityUrl, '_blank', 'location=no');

      window.addEventListener('message', event => {
        if (event.origin.startsWith('http://localhost:4200')) { 
            console.log(event.data); 
            window.removeEventListener('message', function(e){}, false);
            externalWeb.close();
        } else {
            return; 
        } 
    }); 
    }
  }
}
