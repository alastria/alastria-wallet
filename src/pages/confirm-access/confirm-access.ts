import { Component } from '@angular/core';
import { ViewController, NavParams, NavController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { SuccessPage } from '../success/success';
import { ToastService } from '../../services/toast-service';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';


@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public isCredentialRequest: boolean;
    public issName: string;
    private identitySelected: Array<number> = [];
    private credentials: Array<any>;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService,
        private securedStrg: IdentitySecuredStorageService
    ) {
        this.dataNumberAccess = this.navParams.get("dataNumberAccess");
        this.issName = this.navParams.get("issName");
        this.credentials = this.navParams.get("credentials");
        this.isCredentialRequest = this.navParams.get("isCredentialRequest");
    }

    public dismiss() {
        this.navCtrl.setRoot(TabsPage);
        this.viewCtrl.dismiss();
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    public manageCredentials() {
        if (this.isCredentialRequest) {
            this.sendPresentation();
        } else {
            this.saveCredentials();
        }
    }

    private sendPresentation() {
        let securedCredentials;
        let credentialPromises = [];

        for (let i = 0; i < this.identitySelected.length; i++) {
            let index = this.identitySelected[i] - 1;
            credentialPromises.push(this.securedStrg.getJSON(this.credentials[index]["field_name"]));
        }
        Promise.all(credentialPromises)
            .then((result) => {
                console.log(result);
                securedCredentials = result;
            });
        
    }

    private saveCredentials() {
        if (this.identitySelected.length > 0) {
            console.log('Sending Credentials');

            for (let i = 0; i < this.identitySelected.length; i++) {
                let index = this.identitySelected[i] - 1;
                let credentialKeys = Object.getOwnPropertyNames(this.credentials[index]);

                let hasKey;
                let currentCredentialValue;
                let securedCredentials = [];

                this.securedStrg.hasKey(credentialKeys[2])
                    .then(result => {
                        hasKey = result;
                        if (hasKey) {
                            this.securedStrg.matchAndGetJSON(credentialKeys[2])
                                .then(credentials => {
                                    credentials.forEach(credential => {
                                        securedCredentials.push(JSON.parse(credential));
                                    });
                                    console.log(securedCredentials);

                                    this.showLoading();
                                });
                            /* this.securedStrg.getJSON(credentialKeys[2])
                                .then(result => {
                                    currentCredentialValue = result[credentialKeys[2]];
                                    if (this.credentials[index][credentialKeys[2]] !== currentCredentialValue) {
                                        this.securedStrg.setJSON(credentialKeys[2] + "_" + Math.random(), this.credentials[index]);
                                    }
                                }); */
                        } else {
                            this.securedStrg.setJSON(credentialKeys[2], this.credentials[index])
                                .then(() => {
                                    this.showLoading();
                                });
                        }

                    });
            }


        } else {
            this.toastCtrl.presentToast("Por favor seleccione al menos una credential para enviar", 3000);
        }
    }

    public handleIdentitySelect(identitySelect: any) {
        if (identitySelect && identitySelect.value) {
            this.identitySelected.push(identitySelect.id);
        } else {
            this.identitySelected = this.identitySelected.filter(identity => (identity !== identitySelect.id));
        }

        console.log(this.identitySelected);
    }

    public showLoading() {
        let titleSuccess = 'Estamos <strong>actualizando tu AlastriaID</strong>';
        let textSuccess = 'Solo será un momento';
        let imgPrincipal = 'assets/images/alastria/loading.png';
        let imgSuccess = '';
        let page = "loading";

        let modal = this.modalCtrl.create(SuccessPage, {
            titleSuccess: titleSuccess,
            textSuccess: textSuccess,
            imgPrincipal: imgPrincipal,
            imgSuccess: imgSuccess,
            page: page,
            callback: "success"
        });
        modal.present();
        this.viewCtrl.dismiss();
    }
}
