import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
})
export class SuccessPage {

    data = {};

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.data = {
            'cerrar': "assets/images/alastria/ic_close.png",
            'titleSuccess': this.navParams.get('titleSuccess'),
            'textSuccess': this.navParams.get('textSuccess'),
            'imgPrincipal': this.navParams.get('imgPrincipal'),
            'imgSuccess': this.navParams.get('imgSuccess'),
            'page': this.navParams.get('page')
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SuccessPage');
    }

    closeModal() {
        this.navCtrl.pop();
    }
}
