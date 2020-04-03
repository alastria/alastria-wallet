import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { parseCredentials } from '../../utils';

// Pages
import { EntitiesPage } from '../entities/entities';
import { TabsPage } from './../tabsPage/tabsPage';
import { LoginPage } from './../login/login';

// Services
import { SecuredStorageService } from '../../services/securedStorage.service';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    isLoged: boolean;
    token: string;
    credentials: string;

    constructor(
        platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private securedStrg: SecuredStorageService,
        private deeplinks: Deeplinks,
        private app: App
    ) { 
        platform.ready().then(() => {
            this.token = this.navParams.get('token');

            this.deeplinks.route({
                '/': LoginPage,
                '/login': LoginPage,
                '/createAI': LoginPage,
                '/createCredentials': LoginPage,
                '/createPresentations': LoginPage
            }).subscribe(
                (match) => {
                    const path = (match &&  match.$link) ? match.$link.path : null;

                    if (!this.isLoged) {
                        this.controlDeeplink(path, match.$args);
                    }
                },
                (noMatch) => {
                    console.log('No Match ', noMatch);
                }
            );
        });

    }

    async handleLogin(isLogged: boolean): Promise<any> {
        this.isLoged = isLogged;
        if (isLogged) {
            const did = await this.securedStrg.hasKey('userDID');
            if (did) {
                this.navCtrl.setRoot(TabsPage, { token: this.token });
            } else {
                this.navCtrl.setRoot(EntitiesPage, { token: this.token });
            }
        } 
    }

    private controlDeeplink(path: string, args: any) {
        switch (path) {
            case '/createAI':

                this.securedStrg.hasKey('userDID')
                    .then((DID) => {
                         if(!DID) {
                            this.token = args.alastriaToken;
                            this.app.getRootNav().setRoot(HomePage, { token: this.token});
                        }
                    });
                break;
            case '/createCredentials':
                this.token = parseCredentials(args.credentials);

                if (this.isLoged) {
                    this.handleLogin(this.isLoged);
                }
                break;
        
            case '/login':
            case '/createPresentations':
                this.token = args.alastriaToken;

                if (this.isLoged) {
                    this.handleLogin(this.isLoged);
                }
                break;

            default:

                break;
        }
    }

}
