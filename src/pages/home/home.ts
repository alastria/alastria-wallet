import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

// Pages
import { EntitiesPage } from '../entities/entities';
import { TabsPage } from './../tabsPage/tabsPage';

// Services
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    login: any = {};
    tabs: any = {};
    isLoged: Boolean;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private identitySecuredStorageService: IdentitySecuredStorageService
    ) { 
    }

    async handleLogin(isLogged: boolean): Promise<any> {
        this.isLoged = isLogged;
        if (isLogged) {
            const did = await this.identitySecuredStorageService.hasKey('userDID');
            if (did) {
                this.navCtrl.setRoot(TabsPage);
            } else {
                this.navCtrl.setRoot(EntitiesPage);
            }
        } 
    }
}
