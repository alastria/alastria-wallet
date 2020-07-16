import { LoadingController, ModalController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SuccessPage } from '../pages/success/success';
import { Router } from '@angular/router';
enum State {
    HIDED,
    LOADING,
    SUCCESS
}

@Injectable({
    providedIn: 'root',
})
export class LoadingService {

    private readonly TIMER_MS = 3000;

    loading: any;
    private loadingModal: any;
    private currentModalState: State;
    private loadingTimer: Promise<void>;

    constructor(
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private router: Router
    ) {
        this.currentModalState = State.HIDED;
    }

    async openLoading() {
        this.loading = await this.loadingCtrl.create({
          message: 'Please wait...'
        });
        await this.loading.present();

        const { role, data } = await this.loading.onDidDismiss();
    }

    public hide() {
        if (this.loadingModal) {
            return this.modalCtrl.dismiss();
        }
    }

    public async showModal() {
        const titleSuccess = 'Estamos <strong>actualizando tu AlastriaID</strong>';
        const textSuccess = 'Solo será un momento';
        const imgPrincipal = 'assets/images/alastria/loading.png';
        const imgSuccess = '';
        const page = 'loading';
        this.loadingModal = await this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page });
        this.currentModalState = State.LOADING;

        this.loadingTimer = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.TIMER_MS);
        });
        return await this.loadingModal.present();
    }

    public updateModalState(isDeeplink?: boolean) {
        if (!this.loadingTimer) {
            this.loadingTimer = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.TIMER_MS);
            });
        }

        this.loadingTimer.then(() => {
            if (this.currentModalState !== State.SUCCESS) {
                this.showSuccess(isDeeplink);
            } else {
                this.loadingModal.dismiss();
            }
            this.loadingTimer = null;
        });
    }

    public async showSuccess(isDeeplink: boolean) {
        const titleSuccess = '¡Hecho!';
        const textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de <strong>"Actividad"</strong>';
        const imgPrincipal = 'assets/images/alastria/success.png';
        const imgSuccess = 'assets/svg/tabIcon/activity.svg';
        const page = 'success';
        const successModal = await this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page, isDeeplink });
        successModal.onWillDismiss()
            .then((res) => {
                this.router.navigateByUrl('/tabs/index');
            });
        this.currentModalState = State.SUCCESS;

        return await successModal.present();
    }

    async presentModal(componentProps: any): Promise<any> {
        const modal = await this.modalCtrl.create({
          component: SuccessPage,
          componentProps
        });
        return modal;
    }
}
