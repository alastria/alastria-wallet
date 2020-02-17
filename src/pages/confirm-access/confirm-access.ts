import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, NavController } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { LoadingService } from '../../services/loading-service';
import { TabsPage } from '../tabsPage/tabsPage';
import { TokenService } from '../../services/token-service';
import { tokensFactory } from "alastria-identity-lib"
import { AppConfig } from '../../app.config';
import { TransactionService } from '../../services/transaction-service';

@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public issName: string;
    public entitiyName: string;
    public issDID: string;

    private identitySelected: Array<number> = [];
    private identityLoaded = new Array<any>();
    private credentials: Array<any>;
    private verifiedJWT: any;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService,
        private securedStrg: IdentitySecuredStorageService,
        private loadingSrv: LoadingService,
        private tokenSrv: TokenService,
        private transactionSrv: TransactionService,
        private http: HttpClient
    ) {
        this.dataNumberAccess = this.navParams.get(AppConfig.DATA_COUNT);
        this.issName = "Empresa X";
        this.entitiyName = "Entidad publica Ejemplo";
        this.issDID = this.navParams.get(AppConfig.ISSUER);
        this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        this.verifiedJWT = this.navParams.get(AppConfig.VERIFIED_JWT)
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
           
            if (!pendingIdentities.length) {
                this.showLoading();

                const identityDataSelected = [];
                this.identityLoaded.forEach((loaded,idx) => {
                    this.identitySelected.forEach(selected => {
                        if (idx === selected) {
                            identityDataSelected.push(loaded);
                        }
                    });
                });

                const callbackUrl = this.verifiedJWT.payload.pr.procUrl;
                let privKey = ''
                
                this.securedStrg.get('userPrivateKey')
                    .then(result => {
                        privKey = result;
                        console.log('privKey --> ', privKey);
                        return this.securedStrg.getDID();
                    })
                    .then((did) => {
                        console.log('DID ', did);
                        let signedCredentialJwts = securedCredentials.map(securedCredential => {
                            let credentialSubject = securedCredential;
        
                            let credentialJson = tokensFactory.tokens.createCredential(did, this.verifiedJWT.payload.iss, did,
                                this.verifiedJWT.payload.pr['@context'], credentialSubject, this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.navParams.get(AppConfig.JTI));
        
                            return this.tokenSrv.signTokenES(JSON.stringify(credentialJson.payload), privKey.substring(2));
                        });
        
        
                        let presentation = tokensFactory.tokens.createPresentation(did, this.verifiedJWT.payload.iss, did, 
                            this.verifiedJWT.payload.pr['@context'], signedCredentialJwts, callbackUrl, this.verifiedJWT.payload.pr.procHash,
                            this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.navParams.get(AppConfig.JTI));
                        return presentation;  
                    })
                    .then((presentation) => {
                        return this.http.post(callbackUrl, presentation).toPromise()
                            .then(() => {
                                this.securedStrg.setJSON(AppConfig.PRESENTATION_PREFIX + this.navParams.get(AppConfig.JTI), presentation)
                                    .then(() => {
                                        this.showSuccess();
                                    });
                            })
                    })
                    .catch((error) => {
                        console.log('error ', error);
                    })
                
            } else {
                this.toastCtrl.presentToast("Uno o mas campos de los solicitados estan vacios", 3000);
            }
        } else {
            this.toastCtrl.presentToast("Por favor seleccione todas las credenciales solicitadas", 3000);
        }
    }

    private saveCredentials() {
        if (this.identitySelected.length > 0) {
            console.log('Sending Credentials');
            this.showLoading();

            this.identitySelected.reduce((prevVal, index) => {
                return prevVal.then(() => {
                    let credentialKeys = Object.getOwnPropertyNames(this.credentials[index]);

                    let hasKey;
                    let currentCredentialKey = AppConfig.CREDENTIAL_PREFIX + credentialKeys[1];
                    let currentCredentialValue;

                    let finalCredential = this.credentials[index];
                    finalCredential.issuer = this.verifiedJWT[index][AppConfig.PAYLOAD][AppConfig.ISSUER];

                    return this.securedStrg.hasKey(currentCredentialKey)
                        .then(result => {
                            hasKey = result;
                            let ret;
                            if (result) {
                                ret = this.hasKeyPromise(currentCredentialKey, currentCredentialValue, credentialKeys, index, finalCredential);
                            } else {
                                ret = this.noKeyPromise(currentCredentialKey, index, finalCredential);
                            }
                            return ret;
                        });
                });
            }, Promise.resolve()).then(() => {
                this.showSuccess();
            });
        } else {
            this.toastCtrl.presentToast("Por favor seleccione al menos una credential para enviar", 3000);
        }
    }

    private hasKeyPromise(currentCredentialKey: string, currentCredentialValue: string, credentialKeys: any, index: number, finalCredential: any): Promise<any> {
        return this.securedStrg.getJSON(currentCredentialKey)
            .then(result => {
                currentCredentialValue = result[credentialKeys[1]];
                let ret;
                if (this.credentials[index][credentialKeys[1]] !== currentCredentialValue) {
                    ret = this.transactionSrv.addSubjectCredential(this.verifiedJWT[index], this.issDID, "www.google.com");
                }else{
                    ret = Promise.resolve(false);
                }
                return ret;
            })
            .then((result: any) => {
                console.log(result)
                let ret;
                if(result){
                    ret = this.securedStrg.setJSON(currentCredentialKey + "_" + Math.random(), finalCredential);
                }else{
                    ret = false;
                }
                return ret;
            });
    }

    private noKeyPromise(currentCredentialKey: string, index: number, finalCredential: any): Promise<any> {
        return this.transactionSrv.addSubjectCredential(this.verifiedJWT[index], this.verifiedJWT[index][AppConfig.PAYLOAD][AppConfig.ISSUER], "www.google.com")
            .then(result => {
                finalCredential[AppConfig.PSM_HASH] = result;
                return this.securedStrg.setJSON(currentCredentialKey, finalCredential);
            });
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

    public showSuccess() {
        this.loadingSrv.updateModalState();
        this.viewCtrl.dismiss();
    }

    public dismiss() {
        this.navCtrl.setRoot(TabsPage);
        this.viewCtrl.dismiss();
    }
}
