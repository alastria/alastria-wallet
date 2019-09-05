import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, NavController } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { LoadingService } from '../../services/loading-service';
import { TabsPage } from '../tabsPage/tabsPage';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public issName: string;
    public issDID: string;

    private readonly CREDENTIAL_PREFIX = "cred_";
    private readonly PRESENTATION_PREFIX = "present_";

    private identitySelected: Array<number> = [];
    private credentials: Array<any>;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService,
        private securedStrg: IdentitySecuredStorageService,
        private loadingSrv: LoadingService
    ) {
        this.dataNumberAccess = this.navParams.get("dataNumberAccess");
        this.issName = "SERVICE PROVIDER";
        this.issDID = this.navParams.get("iss");
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

        if (this.identitySelected.length === this.credentials.length) {

            let securedCredentials;

            let credentialExistsPromises = this.identitySelected.map((element) => {
                let index = element;
                return this.securedStrg.hasKey(this.CREDENTIAL_PREFIX + this.credentials[index]["field_name"]);
            });

            Promise.all(credentialExistsPromises)
                .then((result) => {
                    let allCredentialsAssigned = !result.some(element => !element);
                    return Promise.resolve(allCredentialsAssigned);
                })
                .then((result) => {
                    if (result === true) {
                        this.showLoading();
                        let credentialPromises = this.identitySelected.map((element) => {
                            let index = element;
                            return this.securedStrg.getJSON(this.CREDENTIAL_PREFIX + this.credentials[index]["field_name"]);
                        });

                        Promise.all(credentialPromises)
                            .then((result) => {
                                securedCredentials = result;

                                let iat = new Date(this.navParams.get("iat") * 1000);
                                let exp = new Date(this.navParams.get("exp") * 1000);
                                let iatString = iat.getDay() + "/" + (iat.getMonth() + 1) + "/" + iat.getFullYear();
                                let expString = exp.getDay() + "/" + (exp.getMonth() + 1) + "/" + exp.getFullYear();

                                let presentation = {
                                    "@context": "https://w3id.org/credentials/v1",
                                    "jti": "https://www.metrovacesa.com/alastria/credentials/3732",
                                    "iss": this.issDID,
                                    "sub": "did:alastria:quorum:testnet1:QmeeasCZ9jLbX...ueBJ7d7csxhb",
                                    "iat": iatString,
                                    "exp": expString,
                                    "nbf": iat,
                                    "credentials": securedCredentials
                                }
                                
                                this.securedStrg.setJSON(this.PRESENTATION_PREFIX + this.navParams.get("jti"), presentation)
                                .then(() => {
                                    this.showSucces();
                                });
                            });
                    } else {
                        this.toastCtrl.presentToast("Uno o mas campos de los solicitados estan vacios", 3000);
                    }
                });
        } else {
            this.toastCtrl.presentToast("Por favor seleccione todas las credenciales solicitadas", 3000);
        }
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
                finalCredential.issuer = this.issDID;

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
        this.viewCtrl.dismiss();
    }

    public dismiss() {
        this.navCtrl.setRoot(TabsPage);
        this.viewCtrl.dismiss();
    }
}
