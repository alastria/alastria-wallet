import { Injectable } from '@angular/core';
import { ToastService } from './toast-service';
import { AlertController, PopoverController, ModalController } from 'ionic-angular';
import { TokenService } from './token-service';
import { ConfirmAccess } from '../pages/confirm-access/confirm-access';
import { ConfirmError } from '../pages/confirmError/confirmError';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { tokensFactory, transactionFactory, UserIdentity } from "alastria-identity-lib"
import { Web3Service } from './web3-service';
import { TransactionService } from './transaction-service';
import { SecuredStorageService } from './securedStorage.service';
import { LoadingService } from './loading-service';
let Wallet = require('ethereumjs-util');

@Injectable()
export class MessageManagerService {
    isDeeplink: boolean = false;

    constructor(private toastCtrl: ToastService,
        public alertCtrl: AlertController,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        private tokenSrv: TokenService,
        private http: HttpClient,
        private web3Srv: Web3Service,
        private transactionSrv: TransactionService,
        private securedStrg: SecuredStorageService,
        private loadingSrv: LoadingService) 
    {
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

        let tokenType = await this.tokenSrv.getTokenType(verifiedJWT);

        this.launchProtocol(tokenType, verifiedJWT, alastriaToken);
    }

    public launchProtocol(protocolType: ProtocolTypes | String, verifiedToken: Array<string>, alastriaToken: string): void {
        if (verifiedToken) {
            switch (protocolType) {
                case ProtocolTypes.presentation:
                    this.prepareCredentials(verifiedToken)
                        .then((tokenData: any) => {
                            let verifiedCredentials = this.prepareVerfiedJWT(verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL])
                            this.showConfirmAccess(AppConfig.SERVICE_PROVIDER, tokenData, 0, 0, false, verifiedCredentials);
                        })
                        .catch(() => {
                            this.showConfirmEror('No se han podido crear las credenciales');
                        })
                    break;
                case ProtocolTypes.presentationRequest:
                    this.showConfirmAccess(verifiedToken[AppConfig.ISSUER], verifiedToken[AppConfig.PAYLOAD][AppConfig.PR][AppConfig.DATA], verifiedToken[AppConfig.IAT],
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

    private showConfirmAccess(iss: string, credentials: Array<any>, iat: number, exp: number, isPresentationRequest = false, verifiedJWT = null, jti?: string) {
        const alert = this.modalCtrl.create(ConfirmAccess, {
            [AppConfig.ISSUER]: iss, [AppConfig.DATA_COUNT]: credentials.length, [AppConfig.VERIFIED_JWT]: verifiedJWT,
            [AppConfig.CREDENTIALS]: credentials, [AppConfig.IAT]: iat, [AppConfig.EXP]: exp, [AppConfig.IS_PRESENTATION_REQ]: isPresentationRequest, [AppConfig.JTI]: jti,
            isDeeplink: this.isDeeplink
        });
        alert.present();
    }

    private showConfirmEror(message?: string) {
        this.loadingSrv.hide();
        const error = {
            message: message ? message : "Error: Contacte con el service provider"
        };
        const alert = this.modalCtrl.create(ConfirmError, { 'error': error });
        alert.present();
    }

    private async createAndSendAlastriaSession(alastriaToken: string): Promise<any> {
        const decodedToken = this.tokenSrv.decodeTokenES(alastriaToken)
        const issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        const callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        let isVerifiedToken: string | object;
        this.loadingSrv.showModal();

        try {

            const issuerPKU = await this.transactionSrv.getCurrentPublicKey(issuerDID);
 
            isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);
            
            if (isVerifiedToken) {
                const identity = await this.securedStrg.getIdentityData();

                const privKey = identity[AppConfig.USER_PRIV_KEY];
                const pku = {
                    id: identity[AppConfig.USER_DID],
                    type: ["CryptographicKey", "EcdsaKoblitzPublicKey"],
                    curve: "secp256k1",
                    expires: Date.now() + (3600*1000),
                    publicKeyHex: identity[AppConfig.USER_PKU]
                };
                const alastriaSession = tokensFactory.tokens.createAlastriaSession("@jwt", issuerDID, pku, alastriaToken);
                const signedAS = tokensFactory.tokens.signJWT(alastriaSession, privKey.substring(2));
                const AIC = {
                    signedAIC: signedAS
                }

                await this.http.post(callbackUrl, AIC).toPromise();
                this.loadingSrv.updateModalState(this.isDeeplink);

            }

        } catch(error) {
            this.loadingSrv.hide();
            this.showConfirmEror();
        }
    }

    private async createAndSendAlastriaAIC(alastriaToken: string) {
        let decodedToken = this.tokenSrv.decodeTokenES(alastriaToken)
        let issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
        let callbackUrl = decodedToken[AppConfig.PAYLOAD][AppConfig.CBU];
        let isVerifiedToken: any;

        try {

            const issuerPKU = await this.transactionSrv.getCurrentPublicKey(issuerDID);

            isVerifiedToken = this.tokenSrv.verifyTokenES(alastriaToken, `04${issuerPKU}`);
            const isIdentityCreated = await this.securedStrg.hasKey(AppConfig.IS_IDENTITY_CREATED);

            if (isVerifiedToken && !isIdentityCreated) {
                this.loadingSrv.showModal();
                const account = this.web3Srv.getWeb3().eth.accounts.create();
                const address = account[AppConfig.ADDRESS];
                const privKey = account[AppConfig.PRIVATE_KEY];
                const pku = "0x" + Wallet.privateToPublic(privKey).toString('hex');
                const subjectIdentity = new UserIdentity(this.web3Srv.getWeb3(), address, privKey.substring(2), 0);
                const createTx = transactionFactory.identityManager.createAlastriaIdentity(this.web3Srv.getWeb3(), pku.substring(2));

                const signedCreateTx = await subjectIdentity.getKnownTransaction(createTx);

                const alastriaAIC = tokensFactory.tokens.createAIC(signedCreateTx, alastriaToken, pku.substring(2));
                const signedToken = tokensFactory.tokens.signJWT(alastriaAIC, privKey.substring(2));
                const AIC = {
                    signedAIC: signedToken
                }
                let DID = null;
                const resultCallbackUrl = await this.http.post(callbackUrl, AIC).toPromise();

                DID = resultCallbackUrl[AppConfig.DID_KEY];
                const proxyAddress = "0x" + DID.split(":")[4]

                await this.securedStrg.set(AppConfig.IS_IDENTITY_CREATED, "1");
                await this.securedStrg.set('ethAddress', address);
                await this.securedStrg.set(AppConfig.USER_PKU, pku);
                await this.securedStrg.set(AppConfig.USER_PRIV_KEY, privKey);
                await this.securedStrg.set(AppConfig.USER_DID, DID);
                await this.securedStrg.set(AppConfig.PROXY_ADDRESS, proxyAddress);
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

                } else {
                    this.loadingSrv.updateModalState(this.isDeeplink);
                }

            } else if (!isVerifiedToken) {
                this.showConfirmEror("Error: No se puede verificar al Service Provider");
            } else {
                this.showConfirmEror("Error: Identidad ya creada");
            }
        } catch (error) {
            console.error('Error', error);
            this.showConfirmEror();
        }

    }

    private prepareCredentials(verifiedToken: string | object) {
        let credentialsJWT = verifiedToken[AppConfig.VERIFIABLE_CREDENTIAL];

        let promises = credentialsJWT.map((credential: any) => {
            let decodedToken = this.tokenSrv.decodeTokenES(credential)
            let issuerDID = decodedToken[AppConfig.PAYLOAD][AppConfig.ISSUER];
            let verifiedJWT = null;

            return this.transactionSrv.getCurrentPublicKey(issuerDID)
                .then(issuerPKU => {
                    verifiedJWT = this.tokenSrv.verifyTokenES(credential, `04${issuerPKU}`);
                    return this.securedStrg.hasKey('isIdentityCreated');
                })
                .then(isIdentityCreated => {
                    if (verifiedJWT && isIdentityCreated) {
                        const credentialSubject = decodedToken[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.CREDENTIALS_SUBJECT];
                        credentialSubject[AppConfig.IAT] = Date.now();
                        credentialSubject[AppConfig.EXP] = decodedToken[AppConfig.PAYLOAD][AppConfig.EXP];
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
            return this.tokenSrv.decodeTokenES(token);
        });
    }
}

export enum ProtocolTypes {
    authentication = "authentication",
    presentation = "presentation",
    presentationRequest = "presentationRequest",
    alastriaToken = "alastriaToken",
    identitySetup = "identitySetup"
}
