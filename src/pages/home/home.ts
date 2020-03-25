import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';

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

    isLoged: Boolean;
    token: string;
    credentials: string;

    constructor(
        platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private securedStrg: SecuredStorageService,
        private deeplinks: Deeplinks
    ) { 

        platform.ready().then(() => {
            this.token = this.navParams.get('token');
            this.deeplinks.route({
                '/': LoginPage,
                '/createAI': LoginPage,
                '/createCredentials': LoginPage
            }).subscribe(
                (match) => {
                    if (match && match.$args) {
                        if (match.$args.alastriaToken) {
                            this.securedStrg.hasKey('userDID')
                                .then((DID) => {
                                    if(!DID) {
                                        this.token = match.$args.alastriaToken;
                                        this.navCtrl.setRoot(HomePage, { token: this.token});
                                    }
                                });
                        } else if (match.$args.credentials) {
                            this.credentials = this.parseCredentials(match.$args.credentials);

                            if (this.isLoged) {
                                    this.navCtrl.setRoot(TabsPage, { credentials: this.credentials });
                            }
                        }
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
                this.navCtrl.setRoot(TabsPage, { credentials: this.credentials });
            } else {
                this.navCtrl.setRoot(EntitiesPage, { token: this.token });
            }
        } 
    }

    private parseCredentials(credentials: string): string {
        let result = {
            verifiableCredential: credentials.split(',')
        }

        return JSON.stringify(result);
    }
}
