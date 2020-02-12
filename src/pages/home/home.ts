import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { EntitiesPage } from '../entities/entities';


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
        public alertCtrl: AlertController
    ) { 
    }

    async handleLogin(isLogged: boolean): Promise<any> {
        this.isLoged = isLogged;
        if (isLogged) {
            this.navCtrl.setRoot(EntitiesPage);
        } 
    }
}
