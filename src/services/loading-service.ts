import { LoadingController, Modal, ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { SuccessPage } from '../pages/success/success';

@Injectable()
export class LoadingService {

    private readonly TIMER_MS = 3000;

    loading: any;
    private loadingModal: Modal;
    private currentModalState: State;
    private loadingTimer: Promise<void>;

    constructor(
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
    ) {
        this.currentModalState = State.HIDED;
    }

    public show() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

    public hide() {
        if (this.loadingModal) {
            this.loadingModal.dismiss();
        }
    }

    public showModal() {
        let titleSuccess = 'Estamos <strong>actualizando tu AlastriaID</strong>';
        let textSuccess = 'Solo será un momento';
        let imgPrincipal = 'assets/images/alastria/loading.png';
        let imgSuccess = '';
        let page = "loading";

        this.loadingModal = this.modalCtrl.create(SuccessPage, {
            titleSuccess: titleSuccess,
            textSuccess: textSuccess,
            imgPrincipal: imgPrincipal,
            imgSuccess: imgSuccess,
            page: page,
            callback: "success"
        });
        this.currentModalState = State.LOADING;
        this.loadingTimer = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.TIMER_MS);
        });
        this.loadingModal.present();
    }

    public updateModalState() {
        this.loadingTimer.then(() => {
            if (this.currentModalState !== State.SUCCESS) {
                this.showSuccess();
            } else {
                this.loadingModal.dismiss();
            }
            this.loadingTimer = null;
        });
    }

    private showSuccess() {
        let titleSuccess = '¡Hecho!';
        let textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de <strong>"Actividad"</strong>';
        let imgPrincipal = 'assets/images/alastria/success.png';
        let imgSuccess = 'assets/images/tabIcon/act.png';
        let page = "success";

        let succesModal = this.modalCtrl.create(SuccessPage, {
            titleSuccess: titleSuccess,
            textSuccess: textSuccess,
            imgPrincipal: imgPrincipal,
            imgSuccess: imgSuccess,
            page: page,
            callback: ""
        });
        this.currentModalState = State.SUCCESS;
        succesModal.present();
        this.loadingModal.dismiss();
        this.loadingModal = succesModal;
    }
}

enum State {
    HIDED,
    LOADING,
    SUCCESS
}
