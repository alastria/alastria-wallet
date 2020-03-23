import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SuccessPage } from '../success/success';

@Component({
    selector: 'page-contructions',
    templateUrl: 'contructions.html',
})
export class ContructionsPage {

    text: string;
    img: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

        this.text = 'Página en construcción'
        this.img = 'assets/images/alastria/underConstruction.jpg'

    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad ContructionsPage');
    }

    closeModal(): void {
        this.navCtrl.pop();
    }

    navegateTo(text: string): void {
        let titleSuccess = '';
        let textSuccess = '';
        let imgPrincipal = '';
        let imgSuccess = '';
        let page = '';
        if (text === 'page-success') {
            titleSuccess = '¡Hecho!';
            textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de "Actividad".';
            imgPrincipal = 'assets/images/alastria/success.png';
            imgSuccess = 'assets/images/tabIcon/act.png';
            page = "success";

            let modal = this.modalCtrl.create(SuccessPage, { titleSuccess: titleSuccess, textSuccess: textSuccess, imgPrincipal: imgPrincipal, imgSuccess: imgSuccess, page: page });
            modal.present();
        }
        // Para pagina de Loading
        else if (text === 'page-loading') {
            titleSuccess = 'Estamos actualizando tu AlastriaID';
            textSuccess = 'Solo será un momento';
            imgPrincipal = 'assets/images/alastria/loading.png';
            imgSuccess = '';
            page = "loading";

            let modal = this.modalCtrl.create(SuccessPage, { titleSuccess: titleSuccess, textSuccess: textSuccess, imgPrincipal: imgPrincipal, imgSuccess: imgSuccess, page: page });
            modal.present();
        }
    }

}
