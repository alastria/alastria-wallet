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
            'cerrar': "assets/images/alastria/ic_close.png",
            'titleSuccess': this.navParams.get('titleSuccess'),
            'textSuccess': this.navParams.get('textSuccess'),
            'imgPrincipal': this.navParams.get('imgPrincipal'),
            'imgSuccess': this.navParams.get('imgSuccess'),
            'page': this.navParams.get('page'),
            'callback': this.navParams.get('callback')
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SuccessPage');
    }

    closeModal() {
        if(this.data["callback"] !== "success"){
            this.navCtrl.setRoot(TabsPage);
        }else{
            this.showSuccess();
            this.viewCtrl.dismiss();
        }
    }

    public showSuccess() {
        let titleSuccess = '¡Hecho!';
        let textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de <strong>"Actividad"</strong>';
        let imgPrincipal = 'assets/images/alastria/success.png';
        let imgSuccess = 'assets/images/tabIcon/act.png';
        let page = "success";

        let modal = this.modalCtrl.create(SuccessPage, { 
            titleSuccess: titleSuccess, 
            textSuccess: textSuccess, 
            imgPrincipal: imgPrincipal, 
            imgSuccess: imgSuccess, 
            page: page, 
            callback: "" });
        modal.present();
    }
}
