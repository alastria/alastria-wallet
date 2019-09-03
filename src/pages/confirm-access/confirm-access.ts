import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { LoadingService } from '../../services/loading-service';


@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public issName: string;

    private readonly CREDENTIAL_PREFIX = "cred_";
    private readonly PRESENTATION_PREFIX = "present_";

    private identitySelected: Array<number> = [];
    private credentials: Array<any>;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService,
        private securedStrg: IdentitySecuredStorageService,
        private loadingSrv: LoadingService
    ) {
        this.dataNumberAccess = this.navParams.get("dataNumberAccess");
        this.issName = this.navParams.get("issName");
        this.credentials = this.navParams.get("credentials");
        this.isPresentationRequest = this.navParams.get("isPresentationRequest");
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    public manageCredentials() {
        if (this.isPresentationRequest) {
            this.sendPresentation();
        } else {
            this.saveCredentials();
        }
    }

    private sendPresentation() {
        let securedCredentials;

        let credentialPromises = this.identitySelected.map((element) => {
            let index = element;
            return this.securedStrg.getJSON(this.CREDENTIAL_PREFIX + this.credentials[index]["field_name"]);
        });

        Promise.all(credentialPromises)
            .then((result) => {
                console.log(result);
                securedCredentials = result;
            });
    }

    private saveCredentials() {
        if (this.identitySelected.length > 0) {
            console.log('Sending Credentials');
            this.showLoading();

            let credentialPromises = this.identitySelected.map((element) => {
                let index = element;
                let credentialKeys = Object.getOwnPropertyNames(this.credentials[index]);

                let hasKey;
                let currentCredentialKey = this.CREDENTIAL_PREFIX + credentialKeys[2];
                let currentCredentialValue;

                let finalCredential = this.credentials[index];
                finalCredential.issuer = this.issName;

                let credentialPromise = this.securedStrg.hasKey(currentCredentialKey)
                    .then(result => {
                        hasKey = result;
                        if (result) {
                            return this.securedStrg.getJSON(currentCredentialKey);
                        } else {
                            return this.securedStrg.setJSON(currentCredentialKey, finalCredential);
                        }
                    }).then(result => {
                        if (hasKey) {
                            currentCredentialValue = result[credentialKeys[2]];
                            if (this.credentials[index][credentialKeys[2]] !== currentCredentialValue) {
                                return this.securedStrg.setJSON(currentCredentialKey + "_" + Math.random(), finalCredential);
                            }
                        } else {
                            return Promise.resolve();
                        }
                    });
                return credentialPromise;

            });

            //TODO: Confirm credential reception on blockchain

            Promise.all(credentialPromises)
                .then(() => {
                    this.showSucces();
                    this.viewCtrl.dismiss();
                });

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
        this.loadingSrv.showModal();
    }

    public showSucces() {
        this.loadingSrv.updateModalState();
    }
}
