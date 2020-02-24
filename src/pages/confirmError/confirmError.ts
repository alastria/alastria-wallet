import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
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
        public viewCtrl: ViewController
    ) {
        this.error = this.navParams.get('error');
        console.log('error ', this.error);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmErrorPage');
    }

    public dismiss(){
        this.viewCtrl.dismiss();
        this.navCtrl.setRoot(TabsPage);
    }
}
