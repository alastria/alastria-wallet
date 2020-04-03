import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { Subscription } from 'rxjs';

// Models
import { Item } from '../../models/item.model';

//Services
import { EntityService } from '../../services/entity.service';
import { MessageManagerService } from '../../services/messageManager-service';
import { SecuredStorageService } from './../../services/securedStorage.service';
import { SocketService } from '../../services/socket.service';

// Pages - Component
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
              private platform: Platform,
              private inAppBrowser: InAppBrowser,
              private messageManagerService: MessageManagerService,
              private securedStrg: SecuredStorageService,
              private socketService: SocketService) {
    this.platform.registerBackButtonAction(async () => {
      const currentStack = this.navCtrl.getViews();

      if (currentStack &&  currentStack.length > 1) {
          this.navCtrl.pop();
      }
    },1);
    this.getEntities();
    this.token = this.navParams.get('token');
    
    if (this.token) {
      this.messageManagerService.prepareDataAndInit(this.token, true);
    }
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
    const pageName = this.getPageName();
    this.navCtrl.push(Camera, { pageName: pageName});
  }

  openBlank(item: Item) {
    if (item.entityUrl) {
      this.externalWeb = this.inAppBrowser.create(item.entityUrl, '_blank', 'location=no');
      this.initSocket();
    }
  }

  private getPageName() {
    const currentStack = this.navCtrl.getViews();
    return (currentStack.length) ? (currentStack[currentStack.length - 1]) ? currentStack[currentStack.length - 1].name : (currentStack[0]) ? currentStack[0].name  : '' : '';
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initSocket(): void {
    this.socketService.initSocket();

    this.subscription.add(this.socketService.onCreateIdentityWs()
      .subscribe((result) => {
        this.securedStrg.set('callbackUrlPut', result.callbackUrl)
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

    this.subscription.add(this.socketService.onFillYourProfileWs()
      .subscribe((result) => {
        this.messageManagerService.prepareDataAndInit(result);
        this.externalWeb.close();
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
