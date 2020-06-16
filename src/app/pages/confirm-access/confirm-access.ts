import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Component, ɵConsole } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { NavParams, ModalController } from '@ionic/angular';

// Libraries
import * as Web3 from 'web3';
import { tokensFactory, transactionFactory } from 'alastria-identity-lib';

// Services
import { TransactionService } from '../../services/transaction-service';
import { TokenService } from '../../services/token-service';
import { Web3Service } from '../../services/web3-service';
import { IdentityService } from '../../services/identity-service';
import { LoadingService } from '../../services/loading-service';
import { ToastService } from '../../services/toast-service';
import { SecuredStorageService } from '../../services/securedStorage.service';

@Component({
    selector: 'confirm-access',
    templateUrl: 'confirm-access.html',
    styleUrls: ['/confirm-access.scss']
})
export class ConfirmAccessPage {
    public dataNumberAccess: number;
    public isPresentationRequest: boolean;
    public issName = 'Empresa X';
    public entitiyName = 'Entidad publica Ejemplo';
    public credentials: Array<any>;
    public isDeeplink = false;
    private identitiesSelected: Array<number> = [];
    private identityLoaded = new Array<any>();
    private verifiedJWTDecode: any;
    private credentialJWT: any;
    private auth: string = AppConfig.AUTH_TOKEN;

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private toastCtrl: ToastService,
        private securedStrg: SecuredStorageService,
        private loadingSrv: LoadingService,
        private transactionSrv: TransactionService,
        private http: HttpClient,
        private web3Srv: Web3Service,
        private identitySrv: IdentityService,
        private tokenSrv: TokenService
    ) {
        this.dataNumberAccess = this.navParams.get(AppConfig.DATA_COUNT);
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        this.isDeeplink = this.navParams.get('isDeeplink');
        this.initiateVariables();
    }

    private async initiateVariables(): Promise<void> {
        const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
        const credentialJWTArr = [];
        if (this.isPresentationRequest) {
            this.verifiedJWTDecode = this.navParams.get(AppConfig.VERIFIED_JWT);
        } else {
            this.credentialJWT = this.navParams.get(AppConfig.VERIFIED_JWT);
            if (this.credentialJWT) {
                this.credentialJWT.map(item => {
                    credentialJWTArr.push(this.tokenSrv.decodeTokenES(item));
                });
            }
            this.verifiedJWTDecode = credentialJWTArr;

        }

        const did = (this.verifiedJWTDecode && this.verifiedJWTDecode.length) ? this.verifiedJWTDecode[0].payload.iss :
            (this.verifiedJWTDecode && this.verifiedJWTDecode.payload) ? this.verifiedJWTDecode.payload.iss : null;
        if (did) {
            const entity = await this.transactionSrv.getEntity(web3, did);
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
            const isAllCredentialsSelected = this.checkIsAllCredentialsSelected();

            if (isAllCredentialsSelected) {
                const securedCredentials = new Array<any>();
                const pendingIdentities = new Array<number>();

                for (const id of this.identitiesSelected) {
                    if (this.identityLoaded[id]) {
                        securedCredentials.push(this.identityLoaded[id]);
                    } else {
                        pendingIdentities.push(id);
                    }
                }

                if (!pendingIdentities.length) {
                    this.showLoading();
                    this.modalCtrl.dismiss();
                    const callbackUrl = this.verifiedJWTDecode.payload.cbu;
                    const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
                    const uri = AppConfig.procUrl;
                    const privKey = await this.securedStrg.get('userPrivateKey');
                    const did = await this.securedStrg.get('userDID');
                    const jti = `Alastria/presentation/${Math.random().toString().substring(5)}`
                    const signedCredentialJwts = this.getSignedCredentials(securedCredentials);
                    const presentation = tokensFactory.tokens.createPresentation(`${did}#keys-1`, did, this.verifiedJWTDecode.payload.iss,
                        this.verifiedJWTDecode.payload.pr['@context'], signedCredentialJwts, AppConfig.procUrl,
                        `0x${this.verifiedJWTDecode.payload.pr.procHash}`, this.verifiedJWTDecode.payload.exp, this.verifiedJWTDecode.payload.nbf, jti);

                    const signedPresentation = tokensFactory.tokens.signJWT(presentation, privKey.substring(2));
                    const presentationPSMHash = tokensFactory.tokens.PSMHash(web3, signedPresentation, did);
                    const addPresentationTx =
                        transactionFactory.presentationRegistry.addSubjectPresentation(web3, presentationPSMHash, uri);

                    await this.identitySrv.init(web3);
                    const subjectPresentationSigned = await this.identitySrv.getKnownTransaction(web3, addPresentationTx);
                    await this.transactionSrv.sendSigned(web3, subjectPresentationSigned);
                    await this.transactionSrv.getSubjectPresentationStatus(web3, did, presentationPSMHash);
                    const httpOptions = {
                        headers: new HttpHeaders({
                          'Content-Type':  'application/json',
                          Authorization: this.auth
                        })
                    };
                    await this.http.post(`${callbackUrl}`, signedPresentation, httpOptions).toPromise();
                    // tslint:disable-next-line: no-string-literal
                    presentation['PSMHash'] = presentationPSMHash;
                    await this.securedStrg.setJSON(AppConfig.PRESENTATION_PREFIX + jti, presentation);

                    this.showSuccess();
                } else {
                    this.toastCtrl.presentToast('Uno o mas campos de los solicitados estan vacios', 3000);
                }
            } else {
                this.toastCtrl.presentToast('Por favor seleccione todas las credenciales solicitadas', 3000);
            }
        } catch (error) {
            console.error('Send presentation error ', error);
        }
    }

    private saveCredentials() {
        try {
            if (this.identitiesSelected.length > 0) {
                this.showLoading();
                this.modalCtrl.dismiss();
                this.identitiesSelected.reduce(async (prevVal: Promise<void>, index: number) => {
                    return prevVal.then(async () => {
                        const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
                        // const web3 = this.web3Srv.getWeb3(this.verifiedJWTDecode.payload.gwu)
                        const key = this.getCreedKey(this.credentials[index]);
                        const currentCredentialKey = AppConfig.CREDENTIAL_PREFIX + key;
                        const finalCredential = this.credentials[index];
                        const entity = await this.transactionSrv.getEntity(web3, finalCredential[AppConfig.ISSUER]);
                        finalCredential.credentialJWT = this.credentialJWT[index];
                        finalCredential.entityName = entity.name;
                        finalCredential.sub = this.verifiedJWTDecode[index][AppConfig.PAYLOAD][AppConfig.SUBJECT];

                        return this.securedStrg.hasKey(currentCredentialKey)
                            .then(async result => {
                                let ret;
                                try {
                                    if (result) {
                                        ret = await this.existKey(web3, currentCredentialKey, key, index, finalCredential);
                                    } else {
                                        ret = await this.notExistKey(web3, currentCredentialKey, index, finalCredential);
                                    }
                                    return ret;
                                } catch (error) {
                                    throw error;
                                }
                            });
                    });
                }, Promise.resolve()).then(() => {
                    this.showSuccess();
                })
                .catch((error) => {
                    this.loadingSrv.hide();
                    this.toastCtrl.presentToast('Ha ocurrido un error !', 3000);
                });
            } else {
                this.toastCtrl.presentToast('Por favor seleccione al menos una credential para enviar', 3000);
            }
        } catch (error) {
            this.loadingSrv.hide();
            this.toastCtrl.presentToast('Ha ocurrido un error !', 3000);
        }
    }

    private getCreedKey(credential: any) {
        let key = '';
        Object.keys(credential).map((keyCredential) => {
            if (keyCredential !== 'levelOfAssurance' && keyCredential !== 'iat' && keyCredential !== 'exp' && keyCredential !== 'iss' &&
                keyCredential !== 'nbf' && keyCredential !== 'sub') {
                key = keyCredential;
            }
        });
        return key;
    }

    private getSignedCredentials(securedCredentials: Array<any>) {
        return securedCredentials.map(securedCredential => {
            return securedCredential.credJWT;
        });
    }

    private async existKey(web3: any, currentCredentialKey: string,  key: any, index: number, finalCredential: any): Promise<any> {
        try {
            const result = await this.securedStrg.getJSON(currentCredentialKey);
            const subDID = await this.securedStrg.get('userDID');

            if (finalCredential.levelOfAssurance >= result.levelOfAssurance) {
                return this.transactionSrv.addSubjectCredential(web3, this.credentialJWT[index], subDID, 'www.google.com')
                    .then(res => {
                        finalCredential[AppConfig.PSM_HASH] = res;
                        return this.securedStrg.setJSON(currentCredentialKey, finalCredential);
                    })
                    .catch((error) => {
                        throw error;
                    });
            } else {
                return 'Credential not registered';
            }
        } catch (error) {
            throw error;
        }
    }

    private async notExistKey(web3: any, currentCredentialKey: string, index: number, finalCredential: any): Promise<any> {
        return this.transactionSrv.addSubjectCredential(web3, this.credentialJWT[index],
                                                        this.verifiedJWTDecode[index][AppConfig.PAYLOAD][AppConfig.SUBJECT], 'www.google.com')
            .then(result => {
                finalCredential[AppConfig.PSM_HASH] = result;
                return this.securedStrg.setJSON(currentCredentialKey, finalCredential);
            })
            .catch(error => {
                throw error;
            });
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

    public async showSuccess() {
        this.loadingSrv.hide();
        this.loadingSrv.updateModalState(this.isDeeplink);
    }

    public dismiss() {
        this.modalCtrl.dismiss();
    }
}
