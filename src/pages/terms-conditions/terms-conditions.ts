import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'page-terms-conditions',
    templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TermsConditionsPage');
    }

    dismiss() {
        let data = { 'accept': 'true' };
        this.viewCtrl.dismiss(data);
    }

    closeModal() {
        this.navCtrl.pop();
    }

}
