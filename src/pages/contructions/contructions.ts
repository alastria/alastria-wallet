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

    //TODO borrar cuando sea necesario
    // Datos para el modal de Succes
    titleSuccess: string;
    textSuccess: string;
    imgPrincipal: string;
    imgSuccess: string;
    page: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

        this.text = 'Página en construcción'
        this.img = 'assets/images/alastria/underConstruction.jpg'

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ContructionsPage');
    }

    closeModal() {
        this.navCtrl.pop();
    }


    // TODO: Quitar, esto es para probar
    navegateTo(text: string) {
        // Para pagina de Success
        if (text === 'page-success') {
            this.titleSuccess = '¡Hecho!';
            this.textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de "Actividad".';
            this.imgPrincipal = 'assets/images/alastria/success.png';
            this.imgSuccess = 'assets/images/tabIcon/act.png';
            this.page = "success";

            let modal = this.modalCtrl.create(SuccessPage, { titleSuccess: this.titleSuccess, textSuccess: this.textSuccess, imgPrincipal: this.imgPrincipal, imgSuccess: this.imgSuccess, page: this.page });
            modal.present();
        }
        // Para pagina de Loading
        else if (text === 'page-loading') {
            this.titleSuccess = 'Estamos actualizando tu AlastriaID';
            this.textSuccess = 'Solo será un momento';
            this.imgPrincipal = 'assets/images/alastria/loading.png';
            this.imgSuccess = '';
            this.page = "loading";

            let modal = this.modalCtrl.create(SuccessPage, { titleSuccess: this.titleSuccess, textSuccess: this.textSuccess, imgPrincipal: this.imgPrincipal, imgSuccess: this.imgSuccess, page: this.page });
            modal.present();
        }
        console.log('Navigating to page: ' + text);
    }

}
