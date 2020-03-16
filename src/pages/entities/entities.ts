import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { Subscription } from 'rxjs';

// Models
import { Item } from '../../models/item.model';

//Services
import { EntityService } from '../../services/entity.service';
import { MessageManagerService } from '../../services/messageManager-service';
import { IdentitySecuredStorageService } from './../../services/securedStorage.service';
import { SocketService } from '../../services/socket.service';

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
  externalWeb: InAppBrowserObject;
  token: string;
  private subscription: Subscription = new Subscription();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public entityService: EntityService,
              private sanitize: DomSanitizer,
              private inAppBrowser: InAppBrowser,
              private messageManagerService: MessageManagerService,
              private identitySecureStorage: IdentitySecuredStorageService,
              private socketService: SocketService) {
    this.getEntities();
    this.token = this.navParams.get('token');
    
    if (this.token) {
      this.messageManagerService.prepareDataAndInit(this.token);
    }
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
      this.externalWeb = this.inAppBrowser.create(item.entityUrl, '_blank', 'location=no');
      this.initSocket(); 
    }
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initSocket(): void {
    this.socketService.initSocket();

    this.subscription.add(this.socketService.onCreateIdentityWv()
      .subscribe((result) => {
        this.identitySecureStorage.set('callbackUrlPut', result.callbackUrl)
              .then(() => {
                this.messageManagerService.prepareDataAndInit(result.alastriaToken);
                this.externalWeb.close();
              })
              .catch((error) => {
                console.error('error ', error);
              });

        this.socketService.sendDisconnect();
      })
    );

    this.subscription.add(this.socketService.onEvent('connect')
      .subscribe(() => {
        console.log('connected - websocket');
      })
    );

    this.subscription.add(this.socketService.onEvent('disconnect')
      .subscribe(() => {
        console.log('disconnected - websocket');
      })
    );
  }
}
