import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ToastService } from './toast-service';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { TokenService } from './token-service';
import { ConfirmAccessPage } from './../pages/confirm-access/confirm-access';
import { ConfirmErrorPage } from './../pages/confirmError/confirmError';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { tokensFactory, transactionFactory, UserIdentity } from 'alastria-identity-lib';
import { Web3Service } from './web3-service';
import { TransactionService } from './transaction-service';
import { SecuredStorageService } from './securedStorage.service';
import { LoadingService } from './loading-service';
import { privateToPublic, toBuffer } from 'ethereumjs-util';

export enum ProtocolTypes {
    authentication = 'authentication',
    presentation = 'presentation',
    presentationRequest = 'presentationRequest',
    alastriaToken = 'alastriaToken',
    identitySetup = 'identitySetup'
}

@Injectable({
    providedIn: 'root',
})
export class MessageManagerService {
    isDeeplink = false;
    private auth: string = AppConfig.AUTH_TOKEN;

    constructor(private toastCtrl: ToastService,
                public alertCtrl: AlertController,
                public popoverCtrl: PopoverController,
                public modalCtrl: ModalController,
                private tokenSrv: TokenService,
                private http: HttpClient,
                private web3Srv: Web3Service,
                private transactionSrv: TransactionService,
                private securedStrg: SecuredStorageService,
                private loadingSrv: LoadingService) {

    }

    public async prepareDataAndInit(alastriaToken: any, isDeeplink?: boolean): Promise<any> {
        let parsedToken: object;
        if (isDeeplink) {
            this.isDeeplink = isDeeplink;
        }

        try {
            parsedToken = JSON.parse(alastriaToken);
        } catch (error) { }
        let verifiedJWT: any;

        if (!parsedToken) {
            verifiedJWT = this.tokenSrv.decodeTokenES(alastriaToken);
        } else {
            verifiedJWT = parsedToken;
        }

        const tokenType = await this.tokenSrv.getTokenType(verifiedJWT);

        this.launchProtocol(tokenType, verifiedJWT, alastriaToken);
    }

    public launchProtocol(protocolType: ProtocolTypes | string, verifiedToken: Array<string>, alastriaToken: string): void {
        if (verifiedToken) {
            switch (protocolType) {
                case ProtocolTypes.presentation:
                    this.prepareCredentials(verifiedToken)
                        .then((tokenData: any) => {
                            const verifiedCredentials = this.prepareVerfiedJWT(verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL]);
                            this.showConfirmAccessPage(AppConfig.SERVICE_PROVIDER, tokenData, 0, 0, false, verifiedCredentials);
                        })
                        .catch(() => {
                            this.showConfirmEror('No se han podido crear las credenciales');
                            this.loadingSrv.hide();
                        });
                    break;
                case ProtocolTypes.presentationRequest:
                    this.showConfirmAccessPage(verifiedToken[AppConfig.ISSUER],
                        verifiedToken[AppConfig.PAYLOAD][AppConfig.PR][AppConfig.DATA], verifiedToken[AppConfig.NBF],
                        verifiedToken[AppConfig.EXP], true, verifiedToken, verifiedToken[AppConfig.JTI]);
                    break;
                case ProtocolTypes.alastriaToken:
                    this.createAndSendAlastriaAIC(alastriaToken);
                    break;
                case ProtocolTypes.identitySetup:
                    this.createAndSendAlastriaSession(alastriaToken);
                    break;
            }
        } else {
            this.toastCtrl.presentToast('Error: Contacte con el service provider', 1000);
        }
    }

    private async showConfirmAccessPage(iss: string, credentials: Array<any>, iat: number,
                                        exp: number, isPresentationRequest = false, verifiedJWT = null, jti?: string) {
        const alert = await this.presentModal(ConfirmAccessPage, {
            [AppConfig.ISSUER]: iss, [AppConfig.DATA_COUNT]: credentials.length, [AppConfig.VERIFIED_JWT]: verifiedJWT,
            [AppConfig.CREDENTIALS]: credentials, [AppConfig.IAT]: iat, [AppConfig.EXP]: exp,
            [AppConfig.IS_PRESENTATION_REQ]: isPresentationRequest, [AppConfig.JTI]: jti, isDeeplink: this.isDeeplink
        });

        return await alert.present();
    }

    private async showConfirmEror(message?: string) {
        const error = {
            message: message ? message : 'Error: Contacte con el service provider'
        };
        const alert = await this.presentModal(ConfirmErrorPage, { error });

        return await alert.present();
    }

    private async createAndSendAlastriaSession(alastriaToken: string): Promise<any> {
        const decodedToken = this.tokenSrv.decodeTokenES(alastriaToken);
        const issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        const callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        const web3 = this.web3Srv.getWeb3(decodedToken[AppConfig.PAYLOAD][AppConfig.GWU]);
        let isVerifiedToken: string | object;
        this.loadingSrv.showModal();

        try {

            const issuerPKU = await this.transactionSrv.getCurrentPublicKey(web3, issuerDID);

            isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);

            if (isVerifiedToken) {
                const identity = await this.securedStrg.getIdentityData();
                const jti = Math.random().toString(36).substring(2);
                const currentDate = Math.floor(Date.now());
                const expDate = currentDate + 86400;

                const privKey = identity[AppConfig.USER_PRIV_KEY];
                const pku = identity[AppConfig.USER_PKU];
                const subjectDID = identity[AppConfig.USER_DID];
                const alastriaSession =
                    tokensFactory.tokens.createAlastriaSession('@jwt', subjectDID, `0x${pku}`, alastriaToken, expDate, currentDate, jti);
                const signedAlastriaSession = tokensFactory.tokens.signJWT(alastriaSession, privKey.substring(2));
                const httpOptions = {
                    headers: new HttpHeaders({
                      'Content-Type':  'application/json',
                      Authorization: this.auth
                    })
                };
                await this.http.post(callbackUrl, signedAlastriaSession, httpOptions).toPromise();
                this.loadingSrv.updateModalState(this.isDeeplink);
                this.loadingSrv.hide();
            }

        } catch (error) {
            this.showConfirmEror();
            this.loadingSrv.hide();
        }
    }

    private async createAndSendAlastriaAIC(alastriaToken: string) {
        const decodedToken = this.tokenSrv.decodeTokenES(alastriaToken);
        const issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        const callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        const web3 = this.web3Srv.getWeb3(decodedToken[AppConfig.PAYLOAD][AppConfig.GWU]);
        let isVerifiedToken: any;
        try {
            const issuerPKU = await this.transactionSrv.getCurrentPublicKey(web3, issuerDID);

            isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);
            const isIdentityCreated = await this.securedStrg.hasKey(AppConfig.IS_IDENTITY_CREATED);

            if (isVerifiedToken && !isIdentityCreated) {
                this.loadingSrv.showModal();
                const account = web3.eth.accounts.create();
                const address = account[AppConfig.ADDRESS];
                const privKey = account[AppConfig.PRIVATE_KEY];
                const pku = '0x' + privateToPublic(toBuffer(privKey)).toString('hex');
                // Get a public key
                const subjectIdentity = new UserIdentity(web3, address, privKey.substring(2), 0);
                const createTx = transactionFactory.identityManager.createAlastriaIdentity(web3, pku.substring(2));

                const signedCreateTx = await subjectIdentity.getKnownTransaction(createTx);

                const alastriaAIC = tokensFactory.tokens.createAIC(signedCreateTx, alastriaToken, pku);
                const signedToken = tokensFactory.tokens.signJWT(alastriaAIC, privKey.substring(2));
                let DID = null;
                const httpOptions = {
                    headers: new HttpHeaders({
                      'Content-Type':  'application/json',
                      Authorization: this.auth
                    })
                };
                const resultCallbackUrl = await this.http.post(callbackUrl, signedToken, httpOptions).toPromise();

                DID = resultCallbackUrl[AppConfig.DID_KEY];

                await this.securedStrg.set(AppConfig.IS_IDENTITY_CREATED, '1');
                await this.securedStrg.set('ethAddress', address);
                await this.securedStrg.set(AppConfig.USER_PKU, pku);
                await this.securedStrg.set(AppConfig.USER_PRIV_KEY, privKey);
                await this.securedStrg.set(AppConfig.USER_DID, DID);
                const hasKeycallbackUrlPut = await this.securedStrg.hasKey('callbackUrlPut');

                if (hasKeycallbackUrlPut) {
                    const callbackUrlPut = await this.securedStrg.get('callbackUrlPut');
                    const userUpdate = {
                        did: DID,
                        vinculated: true
                    };

                    await this.http.put(callbackUrlPut, userUpdate).toPromise();
                    await this.securedStrg.remove('callbackUrlPut');
                    this.loadingSrv.updateModalState(this.isDeeplink);
                    this.loadingSrv.hide();
                } else {
                    this.loadingSrv.updateModalState(this.isDeeplink);
                    this.loadingSrv.hide();
                }

            } else if (!isVerifiedToken) {
                this.showConfirmEror('Error: No se puede verificar al Service Provider');
                this.loadingSrv.hide();

            } else {
                this.showConfirmEror('Error: Identidad ya creada');
                this.loadingSrv.hide();
            }
        } catch (error) {
            this.showConfirmEror();
            this.loadingSrv.hide();
        }

    }

    private prepareCredentials(verifiedToken: string | object) {
        const credentialsJWT = verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL];
        const promises = credentialsJWT.map((credential: any) => {
            const decodedToken = this.tokenSrv.decodeTokenES(credential);
            const issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
            const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
            // const web3 = this.web3Srv.getWeb3(decodedToken[AppConfig.PAYLOAD][AppConfig.GWU]);
            let verifiedJWT = null;

            return this.transactionSrv.getCurrentPublicKey(web3, issuerDID)
                .then(issuerPKU => {
                    verifiedJWT = this.tokenSrv.verifyTokenES(credential, `04${issuerPKU}`);
                    return this.securedStrg.hasKey('isIdentityCreated');
                })
                .then(isIdentityCreated => {
                    if (verifiedJWT && isIdentityCreated) {
                        const credentialSubject = decodedToken[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.CREDENTIALS_SUBJECT];
                        credentialSubject[AppConfig.NBF] = decodedToken[AppConfig.PAYLOAD][AppConfig.NBF];
                        credentialSubject[AppConfig.EXP] = decodedToken[AppConfig.PAYLOAD][AppConfig.EXP];
                        credentialSubject[AppConfig.ISSUER] = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
                        return Promise.resolve(credentialSubject);
                    }
                })
                .catch(error => {
                    console.error('error ', error);
                    throw error;
                });
        });

        return Promise.all(promises);
    }

    private prepareVerfiedJWT(verifiedToken: Array<string>): Array<any> {
        return verifiedToken.map(token => {
            return token;
        });
    }

    async presentModal(page: any, componentProps: any): Promise<any> {
        const modal = await this.modalCtrl.create({
          component: page,
          componentProps
        });
        return modal;
    }
}
