import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
    styleUrls: ['success.scss']
})
export class SuccessPage {

    data = {};
    isDeeplink: any = false;

    constructor(
        public modalCtrl: ModalController,
        private router: Router,
        private navParams: NavParams
    ) {
        this.data = {
            titleSuccess: this.navParams.get('titleSuccess'),
            textSuccess: this.navParams.get('textSuccess'),
            imgPrincipal: this.navParams.get('imgPrincipal'),
            imgSuccess: this.navParams.get('imgSuccess'),
            page: this.navParams.get('page'),
            callback: this.navParams.get('callback'),
        };

        this.isDeeplink = navParams.get('isDeeplink');
    }

    public closeModal() {
        this.modalCtrl.dismiss();
    }
}
