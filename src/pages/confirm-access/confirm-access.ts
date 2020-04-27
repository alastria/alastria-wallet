import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { AppConfig } from '../../app.config';

// Libraries
import * as Web3 from "web3";
import { tokensFactory, transactionFactory } from "alastria-identity-lib";

// Components
import { TabsPage } from '../tabsPage/tabsPage';

// Services
import { TransactionService } from '../../services/transaction-service';
import { Web3Service } from "../../services/web3-service";
import { IdentityService } from "../../services/identity-service";
import { LoadingService } from '../../services/loading-service';
import { ToastService } from '../../services/toast-service';
import { SecuredStorageService } from './../../services/securedStorage.service';

@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {
    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public entitiyName: string = "Entidad pública de ejemplo";
    public isDeeplink: boolean = false;
    private identitiesSelected: Array<number> = [];
    private identityLoaded = new Array<any>();
    private credentials: Array<any>;
    private verifiedJWT: any;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public toastCtrl: ToastService,
        private securedStrg: SecuredStorageService,
        private loadingSrv: LoadingService,
        private transactionSrv: TransactionService,
        private http: HttpClient,
        private web3Srv: Web3Service,
        private identitySrv: IdentityService
    ) {
        this.initiateVariables();
    }

    private async initiateVariables(): Promise<void> {
        this.dataNumberAccess = this.navParams.get(AppConfig.DATA_COUNT);
        this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        this.verifiedJWT = this.navParams.get(AppConfig.VERIFIED_JWT);
        this.isDeeplink = this.navParams.get('isDeeplink');
        const did = (this.verifiedJWT && this.verifiedJWT.length) ? this.verifiedJWT[0].payload.iss :
            (this.verifiedJWT && this.verifiedJWT.payload) ? this.verifiedJWT.payload.iss : null;
        if (did) {
            const entity = await this.transactionSrv.getEntity(did);
            if (entity && entity.name) {
                this.entitiyName = entity.name;
            }
        }
    }

    public manageCredentials(): void {
        if (this.isPresentationRequest) {
            this.sendPresentation();
        } else {
            this.saveCredentials();
        }
    }

    private checkIsAllCredentialsSelected() {
        let isAllCredentialsSelected = true;

        this.credentials.map((credential, i) => {
            if (credential.required) {
                let isCrecentialSelected = false;
                this.identitiesSelected.map(identity => {
                    if (identity === i) {
                        isCrecentialSelected = true;
                    }
                });

                if (!isCrecentialSelected) {
                    isAllCredentialsSelected = false;
                }
            }
        });

        return isAllCredentialsSelected;
    }

    private async sendPresentation(): Promise<any> {
        try {
            let isAllCredentialsSelected = this.checkIsAllCredentialsSelected();
            
            if (isAllCredentialsSelected) {
                const web3: Web3 = this.web3Srv.getWeb3();
                let securedCredentials = new Array<any>();
                let pendingIdentities = new Array<number>();
    
                for (let id of this.identitiesSelected) {
                    if (this.identityLoaded[id]) {
                        securedCredentials.push(this.identityLoaded[id]);
                    } else {
                        pendingIdentities.push(id);
                    }
                }
               
                if (!pendingIdentities.length) {
                    this.showLoading();
                    const callbackUrl = this.verifiedJWT.payload.pr.procUrl;
                    const uri = 'www.google.com'
                    const privKey = await this.securedStrg.get('userPrivateKey');
                    const did = await this.securedStrg.get('userDID');
                    
                    let signedCredentialJwts = this.getSingalCredentials(securedCredentials, did, privKey);
                    let presentation = tokensFactory.tokens.createPresentation(did, this.verifiedJWT.payload.iss, did, 
                        this.verifiedJWT.payload.pr['@context'], signedCredentialJwts, callbackUrl, this.verifiedJWT.payload.pr.procHash,
                        this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.navParams.get(AppConfig.JTI));
                    let signedPresentation = tokensFactory.tokens.signJWT(presentation, privKey.substring(2));
                    let presentationPSMHash = tokensFactory.tokens.PSMHash(web3, signedPresentation, did);
                    let addPresentationTx = transactionFactory.presentationRegistry.addSubjectPresentation(web3, presentationPSMHash, uri);
    
                    presentation[AppConfig.PSM_HASH] = presentationPSMHash;
                    let presentationSigned = tokensFactory.tokens.signJWT(presentation, privKey.substring(2))

                    await this.identitySrv.init();
                    const subjectPresentationSigned = await this.identitySrv.getKnownTransaction(addPresentationTx);
                    await this.transactionSrv.sendSigned(subjectPresentationSigned);
                    await this.transactionSrv.getSubjectPresentationStatus(did.split(':')[4], presentationPSMHash);
                    await this.http.post(`${callbackUrl}?presentationRequestHash=${presentationPSMHash}`, presentationSigned).toPromise();
                    await this.securedStrg.setJSON(AppConfig.PRESENTATION_PREFIX + this.navParams.get(AppConfig.JTI), presentation);
    
                    this.showSuccess();
                } else {
                    this.toastCtrl.presentToast("Uno o mas campos de los solicitados estan vacios", 3000);
                }
            } else {
                this.toastCtrl.presentToast("Por favor seleccione todas las credenciales solicitadas", 3000);
            }
        } catch (error) {
            console.error('Send presentation error ', error);
        }
    }

    private saveCredentials() {
        try {
            if (this.identitiesSelected.length > 0) {
                this.showLoading();
                this.identitiesSelected.reduce(async (prevVal: Promise<void>, index: number) => {
                    return prevVal.then(() => {
                        let credentialKeys = Object.getOwnPropertyNames(this.credentials[index]);
                        let currentCredentialKey = AppConfig.CREDENTIAL_PREFIX + credentialKeys[1];
                        let finalCredential = this.credentials[index];
                        finalCredential.issuer = this.verifiedJWT[index][AppConfig.PAYLOAD][AppConfig.ISSUER];
        
                        return this.securedStrg.hasKey(currentCredentialKey)
                            .then(async result => {
                                let ret;
                                if (result) {
                                    ret = await this.existKey(currentCredentialKey, credentialKeys, index, finalCredential);
                                } else {
                                    ret = await this.notExistKey(currentCredentialKey, index, finalCredential);
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
        } catch(error) {
            console.error('Error save credentials ', error);
        }
    }

    private getSingalCredentials(securedCredentials: Array<any>, did: string, privKey: string) {
        return securedCredentials.map(securedCredential => {
            let credentialSubject = securedCredential;

            let credentialJson = tokensFactory.tokens.createCredential(did, this.verifiedJWT.payload.iss, did,
                this.verifiedJWT.payload.pr['@context'], credentialSubject, this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.navParams.get(AppConfig.JTI));

            return tokensFactory.tokens.signJWT(credentialJson, privKey.substring(2));
        });
    }
    
    private async existKey(currentCredentialKey: string,  credentialKeys: any, index: number, finalCredential: any): Promise<any> {
        try {
            const result = await this.securedStrg.getJSON(currentCredentialKey); 
            let currentCredentialValue = result[credentialKeys[1]];
            let resultAddSubjectCredential: any;
            const issDID = this.navParams.get(AppConfig.ISSUER);

            if (this.credentials[index][credentialKeys[1]] !== currentCredentialValue) {
                resultAddSubjectCredential = this.transactionSrv.addSubjectCredential(this.verifiedJWT[index], issDID, "www.google.com");
            }else {
                resultAddSubjectCredential = false;
            }

            if (resultAddSubjectCredential) {
                return this.securedStrg.setJSON(currentCredentialKey + "_" + Math.random(), finalCredential);
            } else{
                return false;
            }
        } catch(error) {
            throw error;
        }
    }

    private async notExistKey(currentCredentialKey: string, index: number, finalCredential: any): Promise<any> {
        return this.transactionSrv.addSubjectCredential(this.verifiedJWT[index], this.verifiedJWT[index][AppConfig.PAYLOAD][AppConfig.ISSUER], "www.google.com")
            .then(result => {
                finalCredential[AppConfig.PSM_HASH] = result;
                return this.securedStrg.setJSON(currentCredentialKey, finalCredential);
            })
            .catch(error => {
                throw error;
            })
    }

    public handleIdentitySelect(identitySelect: any): void {
        if (identitySelect && identitySelect.value) {
            this.identitiesSelected.push(identitySelect.id);
        } else {
            this.identitiesSelected = this.identitiesSelected.filter(identity => (identity !== identitySelect.id));
        }
    }

    public loadCredential(event: any) {
        this.identityLoaded[event.index] = event.credential;
    }

    public showLoading() {
        this.loadingSrv.showModal();
    }

    public showSuccess() {
        this.loadingSrv.updateModalState(this.isDeeplink);
        this.viewCtrl.dismiss();
    }

    public dismiss() {
        if (this.isDeeplink) {
            this.navCtrl.popTo(TabsPage)
        } else {
            this.navCtrl.setRoot(TabsPage);
        }
    }
}
