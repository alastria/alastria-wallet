import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-terms-conditions',
    templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TermsConditionsPage');
    }

    closeModal() {
        this.navCtrl.pop();
    }

}
