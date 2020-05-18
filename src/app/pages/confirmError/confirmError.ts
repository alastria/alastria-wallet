import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';


@Component({
    selector: 'page-confirmError',
    templateUrl: 'confirmError.html',
    styleUrls: ['/confirmError.scss']
})
export class ConfirmErrorPage {

    error: any;
    pageName: string;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private navParams: NavParams
    ) {
        this.error = this.navParams.get('error');
    }

    async dismiss() {
        this.modalCtrl.dismiss();
    }
}
