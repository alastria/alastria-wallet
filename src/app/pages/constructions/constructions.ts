import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { SuccessPage } from '../success/success';

@Component({
    selector: 'page-contructions',
    templateUrl: 'constructions.html',
})
export class ConstructionsPage {

    text: string;
    img: string;

    constructor(public navCtrl: NavController,
                public modalCtrl: ModalController) {

        this.text = 'Página en construcción'
        this.img = 'assets/images/alastria/underConstruction.jpg'

    }

    closeModal(): void {
        this.navCtrl.back();
    }

    async presentModal(componentProps: any) {
        const modal = await this.modalCtrl.create({
          component: SuccessPage,
          componentProps
        });
        return await modal.present();
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
            page = 'success';

            this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page });
        } else if (text === 'page-loading') {
            titleSuccess = 'Estamos actualizando tu AlastriaID';
            textSuccess = 'Solo será un momento';
            imgPrincipal = 'assets/images/alastria/loading.png';
            imgSuccess = '';
            page = 'loading';
            this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page });
        }
    }

}
