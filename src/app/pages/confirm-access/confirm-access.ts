import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

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
    public isDeeplink = false;
    private identitiesSelected: Array<number> = [];
    private identityLoaded = new Array<any>();
    private credentials: Array<any>;
    private verifiedJWT: any;
    private jti: any;
    private issuer: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastCtrl: ToastService,
        private securedStrg: SecuredStorageService,
        private loadingSrv: LoadingService,
        private tokenSrv: TokenService,
        private transactionSrv: TransactionService,
        private http: HttpClient,
        private web3Srv: Web3Service,
        private identitySrv: IdentityService
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.dataNumberAccess = this.router.getCurrentNavigation().extras.state[AppConfig.DATA_COUNT];
                this.credentials = this.router.getCurrentNavigation().extras.state[AppConfig.CREDENTIALS];
                this.isPresentationRequest = this.router.getCurrentNavigation().extras.state[AppConfig.IS_PRESENTATION_REQ];
                this.verifiedJWT = this.router.getCurrentNavigation().extras.state[AppConfig.VERIFIED_JWT];
                this.isDeeplink = this.router.getCurrentNavigation().extras.state.isDeeplink;
                this.jti = this.router.getCurrentNavigation().extras.state.isDeeplink;
                this.issuer = this.router.getCurrentNavigation().extras.state[AppConfig.ISSUER];
            }
        });
    }

    public manageCredentials(): void {
        if (this.isPresentationRequest) {
            this.sendPresentation();
        } else {
            this.saveCredentials();
        }
    }

    private async sendPresentation(): Promise<any> {
        try {
            if (this.identitiesSelected.length === this.credentials.length) {
                const web3 = this.web3Srv.getWeb3();
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
                    const callbackUrl = this.verifiedJWT.payload.pr.procUrl;
                    const uri = 'www.google.com';
                    const privKey = await this.securedStrg.get('userPrivateKey');
                    const did = await this.securedStrg.getDID();

                    const signedCredentialJwts = this.getSingalCredentials(securedCredentials, did, privKey);
                    const presentation = tokensFactory.tokens.createPresentation(did, this.verifiedJWT.payload.iss, did,
                        this.verifiedJWT.payload.pr['@context'], signedCredentialJwts, callbackUrl, this.verifiedJWT.payload.pr.procHash,
                        this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.jti);
                    const signedPresentation = this.tokenSrv.signTokenES(JSON.stringify(presentation.payload), privKey.substring(2));
                    const presentationPSMHash = tokensFactory.tokens.PSMHash(web3, signedPresentation, did.split(':')[4]);
                    const addPresentationTx = transactionFactory.presentationRegistry.addSubjectPresentation(
                        web3, presentationPSMHash, uri
                    );

                    presentation.payload.vp.procHash = presentationPSMHash;
                    presentation[AppConfig.PSM_HASH] = presentationPSMHash;

                    await this.identitySrv.init();
                    const subjectPresentationSigned = await this.identitySrv.getKnownTransaction(addPresentationTx);
                    await this.transactionSrv.sendSigned(subjectPresentationSigned);
                    await this.transactionSrv.getSubjectPresentationStatus(did.split(':')[4], presentationPSMHash);
                    await this.http.post(callbackUrl, presentation).toPromise();
                    await this.securedStrg.setJSON(AppConfig.PRESENTATION_PREFIX + this.jti, presentation);

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
                this.identitiesSelected.reduce(async (prevVal: Promise<void>, index: number) => {
                    return prevVal.then(() => {
                        const credentialKeys = Object.getOwnPropertyNames(this.credentials[index]);
                        const currentCredentialKey = AppConfig.CREDENTIAL_PREFIX + credentialKeys[1];
                        const finalCredential = this.credentials[index];
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
                this.toastCtrl.presentToast('Por favor seleccione al menos una credential para enviar', 3000);
            }
        } catch (error) {
            console.error('Error save credentials ', error);
        }
    }

    private getSingalCredentials(securedCredentials: Array<any>, did: string, privKey: string) {
        return securedCredentials.map(securedCredential => {
            const credentialSubject = securedCredential;

            const credentialJson = tokensFactory.tokens.createCredential(
                did, this.verifiedJWT.payload.iss, did,
                this.verifiedJWT.payload.pr['@context'], credentialSubject,
                this.verifiedJWT.payload.exp, this.verifiedJWT.payload.iat, this.jti
            );

            return this.tokenSrv.signTokenES(JSON.stringify(credentialJson.payload), privKey.substring(2));
        });
    }

    private async existKey(currentCredentialKey: string,  credentialKeys: any, index: number, finalCredential: any): Promise<any> {
        try {
            const result = await this.securedStrg.getJSON(currentCredentialKey);
            const currentCredentialValue = result[credentialKeys[1]];
            let resultAddSubjectCredential: any;
            const issDID = this.issuer;

            if (this.credentials[index][credentialKeys[1]] !== currentCredentialValue) {
                resultAddSubjectCredential = this.transactionSrv.addSubjectCredential(this.verifiedJWT[index], issDID, 'www.google.com');
            } else {
                resultAddSubjectCredential = false;
            }

            if (resultAddSubjectCredential) {
                return this.securedStrg.setJSON(currentCredentialKey + '_' + Math.random(), finalCredential);
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    private async notExistKey(currentCredentialKey: string, index: number, finalCredential: any): Promise<any> {
        return this.transactionSrv.addSubjectCredential(
            this.verifiedJWT[index], this.verifiedJWT[index][AppConfig.PAYLOAD][AppConfig.ISSUER], 'www.google.com'
        )
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

    public showSuccess() {
        this.loadingSrv.updateModalState(this.isDeeplink);
    }

    public dismiss() {
        if (this.isDeeplink) {
            this.router.navigate(['/', 'tabs']);
        }
    }
}
