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

@IonicPage()
@Component({
    templateUrl: 'camera.html',
    providers: [TabsService, ToastService]
})

export class Camera {

    private readonly QR_CODE = "QR_CODE";
    private readonly VERIFIABLE_CREDENTIAL = "verifiableCredential";

    data: any = {};
    cameraEnabled = true;
    file: File;

    constructor(private toastCtrl: ToastService,
        public barcodeScanner: BarcodeScanner,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        private tokenSrv: TokenService) {
        this.data = {
            title: "Cámara",
            format: "Escaneo de QRCodes blockchain",
            text: "Desde aquí puede leer códigos blockchain formateados como QRCode. Utilice la cámara de su dispositivo."
        }

        let options = {
            prompt: "Situe el código Qr en el interior del rectángulo.",
            formats: this.QR_CODE
        }

        this.barcodeScanner.scan(options).then(barcodeData => {
            console.log('QR data', barcodeData.text);
            let alastriaToken = barcodeData.text;
            let secret = "your-256-bit-secret";
            let parsedToken = JSON.parse(alastriaToken);
            let verifiedJWT;

            if (!parsedToken[this.VERIFIABLE_CREDENTIAL]) {
                verifiedJWT = this.tokenSrv.verifyToken(alastriaToken, secret);
            } else {
                verifiedJWT = parsedToken;
            }

            let tokenType = this.tokenSrv.getTokenType(verifiedJWT);

            this.launchProtocol(tokenType, verifiedJWT, secret);
        }).catch(err => {
            console.log('Error', err);
            this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
            this.navCtrl.setRoot(Index);
        });
    }

    private showConfirmLogin(iss: string, issName: string, cbu: string, as: string | object) {
        const alert = this.modalCtrl.create(ConfirmLogin, { "iss": iss, "issName": issName, "cbu": cbu, "as": as });
        alert.present();
    }

    private showConfirmAcces(iss: string, credentials: Array<any>, iat: number, exp: number, isPresentationRequest = false, jti?: string) {
        const alert = this.modalCtrl.create(ConfirmAccess, { "iss": iss, "dataNumberAccess": credentials.length, "credentials": credentials, "iat": iat, "exp": exp, "isPresentationRequest": isPresentationRequest, "jti": jti });
        alert.present();
    }

    private launchProtocol(protocolType: ProtocolTypes | String, verifiedToken: string | object, secret: string) {
        let alastriaSession;

        if (verifiedToken) {
            alastriaSession = this.tokenSrv.getSessionToken(verifiedToken);
            switch (protocolType) {
                case ProtocolTypes.authentication:
                    this.showConfirmLogin(verifiedToken["iss"], "SERVICE PROVIDER", verifiedToken["cbu"], alastriaSession);
                    break;
                case ProtocolTypes.presentation:
                    let tokenData = this.prepareCredentials(verifiedToken, secret);
                    this.showConfirmAcces("SERVICE PROVIDER", tokenData["credentialsData"], tokenData["iat"], tokenData["exp"], false);
                    break;
                case ProtocolTypes.presentationRequest:
                    this.showConfirmAcces(verifiedToken["iss"], verifiedToken["pr"]["data"], verifiedToken["iat"], verifiedToken["exp"], true, verifiedToken["jti"]);
                    break;
            }
        } else {
            this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
        }
    }

    private prepareCredentials(verifiedToken: string | object, secret: string) {
        let iat;
        let exp;
        let credentialsJWT = verifiedToken[this.VERIFIABLE_CREDENTIAL];
        let credentialsData = credentialsJWT.map(credential => {
            let verifiedJWT = this.tokenSrv.verifyToken(credential, secret);
            iat = verifiedJWT["iat"];
            exp = verifiedJWT["exp"];
            return verifiedJWT["vc"]["credentialSubject"];
        });
        return {
            "iat": iat,
            "exp": exp,
            "credentialsData": credentialsData
        };
    }
}

export enum ProtocolTypes {
    authentication = "authentication",
    presentation = "presentation",
    presentationRequest = "presentationRequest"
}
