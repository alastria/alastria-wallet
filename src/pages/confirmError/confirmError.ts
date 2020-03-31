import { EntitiesPage } from './../entities/entities';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';

@Component({
    selector: 'page-confirmError',
    templateUrl: 'confirmError.html',
})
export class ConfirmError {

    error: any;
    pageName: string;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public modalCtrl: ModalController,
        public viewCtrl: ViewController
    ) {
        this.error = this.navParams.get('error');
        this.pageName = this.navParams.get('pageName');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmErrorPage');
    }

    async dismiss(){
        try {
            if(this.pageName === 'TabsPage' || this.pageName === 'Camera' || this.pageName === 'Index') {
                this.navCtrl.setRoot(TabsPage);
            } else if (this.pageName === 'EntitiesPage') {
                this.navCtrl.setRoot(TabsPage);
                this.navCtrl.push(EntitiesPage);
            } else {
                this.navCtrl.pop();
            }
        } catch(error) {
            console.error(error);
        }
    }
}
