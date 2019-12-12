import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, NavController } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { LoadingService } from '../../services/loading-service';
import { TabsPage } from '../tabsPage/tabsPage';
import { TokenService } from '../../services/token-service';
import { tokensFactory } from "alastria-identity-lib"
import { AppConfig } from '../../app.config';

@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public issName: string;
    public issDID: string;

    private identitySelected: Array<number> = [];
    private identityLoaded = new Array<any>();
    private credentials: Array<any>;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService,
        private securedStrg: IdentitySecuredStorageService,
        private loadingSrv: LoadingService,
        private tokenSrv: TokenService
    ) {
        this.dataNumberAccess = this.navParams.get(AppConfig.DATA_COUNT);
        this.issName = AppConfig.SERVICE_PROVIDER;
        this.issDID = this.navParams.get(AppConfig.ISSUER);
        this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        for (let id of this.credentials) {
            this.identityLoaded.push(undefined);
        }
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
        console.log("Selected ids: ", this.identitySelected);
        if (this.identitySelected.length === this.credentials.length) {
            let securedCredentials = new Array<any>();
            let pendingIdentities = new Array<number>();

            for (let id of this.identitySelected) {
                if (this.identityLoaded[id]) {
                    securedCredentials.push(this.identityLoaded[id]);
                } else {
                    pendingIdentities.push(id);
                }
            }
            let credentialExistsPromises = pendingIdentities.map((element) => {
                let index = element;
                return this.securedStrg.hasKey(AppConfig.CREDENTIAL_PREFIX + this.credentials[index][AppConfig.FIELD_NAME]);
            });

            Promise.all(credentialExistsPromises)
                .then((result) => {
                    let allCredentialsAssigned = !result.some(element => !element);
                    return Promise.resolve(allCredentialsAssigned);
                })
                .then((result) => {
                    if (result === true) {
                        this.showLoading();
                        let credentialPromises = pendingIdentities.map((element) => {
                            let index = element;
                            return this.securedStrg.getJSON(AppConfig.CREDENTIAL_PREFIX + this.credentials[index][AppConfig.FIELD_NAME]);
                        });

                        Promise.all(credentialPromises)
                            .then((result) => {
                                securedCredentials = securedCredentials.concat(result);
                                let iat = Math.round(Date.now()/1000);
                                let exp = this.navParams.get(AppConfig.EXP);

                                let kidCredential = "did:ala:quor:redt:QmeeasCZ9jLbXueBJ7d7csxhb#keys-1";
                                let didIsssuer = this.issDID;
                                let subjectAlastriaID = "did:alastria:quorum:testnet1:QmeeasCZ9jLbX...ueBJ7d7csxhb";
                                let context = ["https://www.w3.org/2018/credentials/v1", "JWT"];
                                let jti = this.navParams.get(AppConfig.JTI);
                                let procHash = "H398sjHd...kldjUYn475n";
                                let procUrl = "https://www.metrovacesa.com/alastria/businessprocess/4583";

                                let signedCredentialJwts = securedCredentials.map(securedCredential => {
                                    let credentialSubject = securedCredential;

                                    let credentialJson = tokensFactory.tokens.createCredential(kidCredential, didIsssuer, subjectAlastriaID,
                                        context, credentialSubject, exp, iat, jti);

                                    return this.tokenSrv.signToken(JSON.stringify(credentialJson));
                                });

                                let presentation = tokensFactory.tokens.createPresentation(kidCredential, didIsssuer, subjectAlastriaID, context, signedCredentialJwts, 
                                    procUrl, procHash, exp, iat, jti);

                                this.securedStrg.setJSON(AppConfig.PRESENTATION_PREFIX + this.navParams.get(AppConfig.JTI), presentation)
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
                let currentCredentialKey = AppConfig.CREDENTIAL_PREFIX + credentialKeys[1];
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
                            currentCredentialValue = result[credentialKeys[1]];
                            if (this.credentials[index][credentialKeys[1]] !== currentCredentialValue) {
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

    public loadCredential(event: any) {
        this.identityLoaded[event.index] = event.credential;
        console.log(this.identityLoaded)
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
