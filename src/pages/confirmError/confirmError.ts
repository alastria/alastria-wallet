import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { AppConfig } from './../../app.config';
import { IdentitySecuredStorageService } from './../../services/securedStorage.service';

import { EntitiesPage } from './../entities/entities';
import { TabsPage } from '../tabsPage/tabsPage';

@Component({
    selector: 'page-confirmError',
    templateUrl: 'confirmError.html',
})
export class ConfirmError {

    public error: any;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        private identitySecuredStorageService: IdentitySecuredStorageService
    ) {
        this.error = this.navParams.get('error');
        console.log('error ', this.error);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmErrorPage');
    }

    async dismiss(){
        this.viewCtrl.dismiss();
        try {
            const DID = await this.identitySecuredStorageService.hasKey(AppConfig.USER_DID);

            if (DID) {
                this.navCtrl.setRoot(TabsPage);
            } else {
                this.navCtrl.setRoot(EntitiesPage);
            }
        } catch(error) {

        }
    }
}
