import { Injectable } from '@angular/core';
import { ToastService } from './toast-service';
import { AlertController, NavController, PopoverController, ModalController, App } from 'ionic-angular';
import { ConfirmLogin } from '../pages/confirmLogin/confirmLogin';
import { Index } from '../pages/tabsPage/index/index';
import { TokenService } from './token-service';
import { ConfirmAccess } from '../pages/confirm-access/confirm-access';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { tokensFactory, transactionFactory, UserIdentity } from "alastria-identity-lib"
import { Web3Service } from './web3-service';
import { TransactionService } from './transaction-service';
import { IdentitySecuredStorageService } from './securedStorage.service';
import { LoadingService } from './loading-service';
let Wallet = require('ethereumjs-util');

@Injectable()
export class MessageManagerService {

    public navCtrl: NavController;

    constructor(private toastCtrl: ToastService,
        public alertCtrl: AlertController,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        private tokenSrv: TokenService,
        private http: HttpClient,
        private web3Srv: Web3Service,
        private transactionSrv: TransactionService,
        private secureStorage: IdentitySecuredStorageService,
        private loadingSrv: LoadingService,
        app: App) 
    {
        this.navCtrl = app.getActiveNav();
    }

    public async prepareDataAndInit(alastriaToken) {
        let parsedToken;
        try {
            parsedToken = JSON.parse(alastriaToken);
        } catch (error) { }
        let verifiedJWT;

        if (!parsedToken) {
            verifiedJWT = this.tokenSrv.decodeTokenES(alastriaToken);
        } else {
            verifiedJWT = parsedToken;
        }

        let tokenType = await this.tokenSrv.getTokenType(verifiedJWT);

        this.launchProtocol(tokenType, verifiedJWT, alastriaToken, AppConfig.SECRET);
    }

    public launchProtocol(protocolType: ProtocolTypes | String, verifiedToken: Array<string>, alastriaToken: string, secret: string) {
        let alastriaSession;

        if (verifiedToken) {
            alastriaSession = this.tokenSrv.getSessionToken(verifiedToken);
            switch (protocolType) {
                case ProtocolTypes.authentication:
                    this.showConfirmLogin(verifiedToken[AppConfig.ISSUER], AppConfig.SERVICE_PROVIDER, verifiedToken[AppConfig.CBU], alastriaSession);
                    break;
                case ProtocolTypes.presentation:
                    let tokenData = this.prepareCredentials(verifiedToken, secret);
                    let verifiedCredentials = this.prepareVerfiedJWT(verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL], secret)
                    this.showConfirmAcces(AppConfig.SERVICE_PROVIDER, tokenData[AppConfig.CREDENTIALS_DATA], tokenData[AppConfig.IAT],
                        tokenData[AppConfig.EXP], false, verifiedCredentials);
                    break;
                case ProtocolTypes.presentationRequest:
                    this.showConfirmAcces(verifiedToken[AppConfig.ISSUER], verifiedToken[AppConfig.PR][AppConfig.DATA], verifiedToken[AppConfig.IAT],
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
            this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
        }
    }

    private showConfirmLogin(iss: string, issName: string, cbu: string, as: string | object) {
        const alert = this.modalCtrl.create(ConfirmLogin, { [AppConfig.ISSUER]: iss, [AppConfig.ISSUER_NAME]: issName, [AppConfig.CBU]: cbu, [AppConfig.AS]: as });
        alert.present();
    }

    private showConfirmAcces(iss: string, credentials: Array<any>, iat: number, exp: number, isPresentationRequest = false, verifiedJWT = null, jti?: string) {
        const alert = this.modalCtrl.create(ConfirmAccess, {
            [AppConfig.ISSUER]: iss, [AppConfig.DATA_COUNT]: credentials.length, [AppConfig.VERIFIED_JWT]: verifiedJWT,
            [AppConfig.CREDENTIALS]: credentials, [AppConfig.IAT]: iat, [AppConfig.EXP]: exp, [AppConfig.IS_PRESENTATION_REQ]: isPresentationRequest, [AppConfig.JTI]: jti
        });
        alert.present();
    }

    private createAndSendAlastriaSession(alastriaToken: string) {
        let decodedToken = this.tokenSrv.decodeTokenES(alastriaToken)
        let issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        let callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        let isVerifiedToken;

        this.loadingSrv.showModal();
        this.transactionSrv.getCurrentPublicKey(issuerDID)
            .then(issuerPKU => {
                isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);
                return this.secureStorage.getIdentityData();
            }).then(identity => {
                if (isVerifiedToken) {
                    let privKey = identity[AppConfig.USER_PRIV_KEY];
                    let signedAT = tokensFactory.tokens.signJWT(alastriaToken, privKey.substring(2));
                    let alastriaSession = tokensFactory.tokens.createAlastriaSession("@jwt", identity[AppConfig.USER_DID], identity[AppConfig.USER_PKU].substring(2), signedAT);
                    let signedAS = tokensFactory.tokens.signJWT(alastriaSession, privKey.substring(2));
                    
                    let AIC = {
                        signedAIC: signedAS
                    }

                    this.http.post(callbackUrl, AIC).subscribe(result => {
                        console.log(result);
                        this.loadingSrv.updateModalState();
                    }, error => {
                        console.log('Error', error);
                        this.showErrorToast();
                    })
                }
            })
            .catch(error => {
                this.showErrorToast();
            });
    }

    private createAndSendAlastriaAIC(alastriaToken: string) {
        let decodedToken = this.tokenSrv.decodeTokenES(alastriaToken)
        let issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        let callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        let isVerifiedToken;

        this.transactionSrv.getCurrentPublicKey(issuerDID)
            .then(issuerPKU => {
                isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);
                return this.secureStorage.hasKey(AppConfig.IS_IDENTITY_CREATED)
            })
            .then(result => {
                if (isVerifiedToken && !result) {
                    this.loadingSrv.showModal();
                    let account = this.web3Srv.getWeb3().eth.accounts.create();
                    let address = account[AppConfig.ADDRESS];
                    let privKey = account[AppConfig.PRIVATE_KEY];
                    let pku = "0x" + Wallet.privateToPublic(privKey).toString('hex');

                    let subjectIdentity = new UserIdentity(this.web3Srv.getWeb3(), address, privKey.substring(2), 0);

                    let createTx = transactionFactory.identityManager.createAlastriaIdentity(this.web3Srv.getWeb3(), pku.substring(2));

                    subjectIdentity.getKnownTransaction(createTx).then(signedCreateTx => {
                        let alastriaTokenSigned = tokensFactory.tokens.signJWT(alastriaToken, privKey.substring(2));

                        let alastriaAIC = tokensFactory.tokens.createAIC(signedCreateTx, alastriaTokenSigned, pku.substring(2));

                        let signedToken = tokensFactory.tokens.signJWT(alastriaAIC, privKey.substring(2));

                        let AIC = {
                            signedAIC: signedToken
                        }

                        this.http.post(callbackUrl, AIC).subscribe(result => {
                            let proxyAddress = result[AppConfig.PROXY_ADDRESS];
                            let DID = result[AppConfig.DID_KEY]
                            this.secureStorage.set(AppConfig.IS_IDENTITY_CREATED, "1");
                            this.secureStorage.set(AppConfig.USER_PKU, pku);
                            this.secureStorage.set(AppConfig.USER_PRIV_KEY, privKey);
                            this.secureStorage.set(AppConfig.USER_DID, DID);
                            this.secureStorage.set(AppConfig.PROXY_ADDRESS, proxyAddress);
                            this.loadingSrv.updateModalState();
                        }, error => {
                            console.log('Error', error);
                            this.showErrorToast();
                        })
                    });
                } else if (!isVerifiedToken) {
                    this.showErrorToast("Error: No se puede verificar al Service Provider");
                } else {
                    this.showErrorToast("Error: Identidad ya creada");
                }
            })
            .catch(err => {
                console.log('Error', err);
                this.showErrorToast();
            });
    }

    private prepareCredentials(verifiedToken: string | object, secret: string) {
        let iat;
        let exp;
        let credentialsJWT = verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL];
        let credentialsData = credentialsJWT.map(credential => {
            let verifiedJWT = this.tokenSrv.verifyToken(credential, secret);
            iat = verifiedJWT[AppConfig.IAT];
            exp = verifiedJWT[AppConfig.EXP];
            return verifiedJWT[AppConfig.VC][AppConfig.CREDENTIALS_SUBJECT];
        });
        return {
            [AppConfig.IAT]: iat,
            [AppConfig.EXP]: exp,
            [AppConfig.CREDENTIALS_DATA]: credentialsData
        };
    }

    private prepareVerfiedJWT(verifiedToken: Array<string>, secret: string) {
        return verifiedToken.map(token => {
            return this.tokenSrv.decodeToken(token);
        });
    }

    private showErrorToast(msg?: string) {
        msg = msg ? msg : "Error: Contacte con el service provider";
        this.toastCtrl.presentToast(msg, 3000);
        this.navCtrl.setRoot(Index);
        this.loadingSrv.hide();
    }
}

export enum ProtocolTypes {
    authentication = "authentication",
    presentation = "presentation",
    presentationRequest = "presentationRequest",
    alastriaToken = "alastriaToken",
    identitySetup = "identitySetup"
}
