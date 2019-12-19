import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { ConfirmLogin } from '../../confirmLogin/confirmLogin';
import { Index } from '../index';
import { TokenService } from '../../../services/token-service';
import { ConfirmAccess } from '../../confirm-access/confirm-access';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
    templateUrl: 'camera.html',
    providers: [TabsService, ToastService]
})

export class Camera {

    data: any = {};
    cameraEnabled = true;
    file: File;

    constructor(private toastCtrl: ToastService,
        public barcodeScanner: BarcodeScanner,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        private tokenSrv: TokenService,
        private http: HttpClient) {
        this.data = {
            title: "Cámara",
            format: "Escaneo de QRCodes blockchain",
            text: "Desde aquí puede leer códigos blockchain formateados como QRCode. Utilice la cámara de su dispositivo."
        }

        let options = {
            prompt: "Situe el código Qr en el interior del rectángulo.",
            formats: AppConfig.QR_CODE
        }

        this.barcodeScanner.scan(options).then(barcodeData => {
            console.log('QR data', barcodeData.text);
            let httpRegex = /http:\/\//;
            let alastriaToken = barcodeData.text;
            if (httpRegex.test(alastriaToken)){
                this.http.get(alastriaToken).subscribe(data => {
                    this.prepareDataAndInit(data);
                }, error => {
                    console.log('Error', error);
                    this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
                    this.navCtrl.setRoot(Index);
                });
            }else{
                this.prepareDataAndInit(alastriaToken);
            }
            
        }).catch(err => {
            console.log('Error', err);
            this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
            this.navCtrl.setRoot(Index);
        });
    }

    private prepareDataAndInit(alastriaToken){
        let parsedToken;
            try {
                parsedToken = JSON.parse(alastriaToken);
            } catch (error) { }
            let verifiedJWT;

            if (!parsedToken) {
                verifiedJWT = this.tokenSrv.verifyToken(alastriaToken, AppConfig.SECRET);
            } else {
                verifiedJWT = parsedToken;
            }

            let tokenType = this.tokenSrv.getTokenType(verifiedJWT);

            this.launchProtocol(tokenType, verifiedJWT, AppConfig.SECRET);
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

    private launchProtocol(protocolType: ProtocolTypes | String, verifiedToken: Array<string>, secret: string) {
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
            }
        } else {
            this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
        }
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

    private prepareVerfiedJWT(verifiedToken: Array<string>, secret: string){
        return verifiedToken.map(token => {
            return this.tokenSrv.decodeToken(token);
        });
    }
}

export enum ProtocolTypes {
    authentication = "authentication",
    presentation = "presentation",
    presentationRequest = "presentationRequest"
}
