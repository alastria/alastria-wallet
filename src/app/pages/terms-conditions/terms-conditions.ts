import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'page-terms-conditions',
    templateUrl: 'terms-conditions.html',
    styleUrls: ['/terms-conditions.scss']
})
export class TermsConditionsPage {

    constructor(public navCtrl: NavController) {
    }

    dismiss() {
        const data = { accept: 'true' };
        this.closeModal();
    }

    closeModal() {
        this.navCtrl.back();
    }

}
