import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';


@IonicPage()
@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
})
export class SuccessPage {

    data = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public viewCtrl: ViewController
    ) {
        this.data = {
            'titleSuccess': this.navParams.get('titleSuccess'),
            'textSuccess': this.navParams.get('textSuccess'),
            'imgPrincipal': this.navParams.get('imgPrincipal'),
            'imgSuccess': this.navParams.get('imgSuccess'),
            'page': this.navParams.get('page'),
            'callback': this.navParams.get('callback')
        }
    }

    public closeModal() {
        this.navCtrl.setRoot(TabsPage);
    }
}
