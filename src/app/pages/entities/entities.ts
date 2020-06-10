import { Component, OnDestroy } from '@angular/core';
import { NavController, Platform, } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { Subscription, Observable } from 'rxjs';
import { share, map } from 'rxjs/operators';

// Models
import { Item } from '../../models/item.model';

// Services
import { EntityService } from '../../services/entity.service';
import { MessageManagerService } from '../../services/messageManager-service';
import { SecuredStorageService } from '../../services/securedStorage.service';
import { SocketService } from '../../services/socket.service';

// Pages - Component
import { Router, ActivatedRoute } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

/**
 * Generated class for the EntitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-entities',
  templateUrl: 'entities.html',
  styleUrls: ['/entities.scss']
})
export class EntitiesPage implements OnDestroy {
  entities: Observable<Array<Item>>;
  url: any;
  externalWeb: InAppBrowserObject;
  token: string;
  private subscription: Subscription = new Subscription();

  constructor(private navCtrl: NavController,
              private entityService: EntityService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private platform: Platform,
              private inAppBrowser: InAppBrowser,
              private messageManagerService: MessageManagerService,
              private securedStrg: SecuredStorageService,
              private socketService: SocketService,
              private deeplinks: Deeplinks) {
    this.platform.backButton.subscribe(() => {
      this.navCtrl.back();
    });
    this.entities = this.getEntities().pipe(share());
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params.token;
      if (this.token) {
        this.messageManagerService.prepareDataAndInit(this.token, false);
      }
    });

    this.deeplinks.route({
      '/createAI': EntitiesPage,
    }).subscribe(
        (match) => {
          this.securedStrg.hasKey('userDID')
            .then((DID) => {
              this.token = match.$args.alastriaToken;
              this.messageManagerService.prepareDataAndInit(this.token, false);
            });
        },
        (noMatch) => {
        }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEntities(searchItem?: string) {
    try {
      return this.entityService.getEntities(searchItem);
    } catch (error) {
      console.error(error);
    }
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.entities = this.getEntities().pipe(map((entities => {
      return entities.filter((entity: any) => {
        if (entity.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            entity.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          return entity;
        }
      });
    })));
  }

  readQr() {
    this.router.navigate(['/', 'camera']);
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
