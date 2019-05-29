import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { ConfirmLogin } from '../../confirmLogin/confirmLogin';
import { Index } from '../index';
import { TokenService } from '../../../services/token-service';

@IonicPage()
@Component({
  templateUrl: 'camera.html',
  providers: [TabsService, ToastService]
})
export class Camera {

  qrCode: string;
  data: any = {};
  cameraEnabled: boolean = true;
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
      formats: "QR_CODE"
    }
    this.barcodeScanner.scan(options).then(barcodeData => {
      console.log('QR data', barcodeData.text);
      let alastriaToken = barcodeData.text;
      let secret = "your-256-bit-secret";

      let verifiedJWT = this.tokenSrv.verifyToken(alastriaToken, secret);

      let tokenType = this.tokenSrv.getTokenType(verifiedJWT);

      switch (tokenType){
        case "authentication":
            this.authProtocol(verifiedJWT, secret);
            break;
        case "credentialRequest":
            this.credentialProtocol(verifiedJWT, secret);
            break;
      }
    }).catch(err => {
      console.log('Error', err);
      this.qrCode = "hola";
      this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
      this.navCtrl.setRoot(Index);
    });
  }

  private showAlert(iss: string, issName: string, cbu: string, as: string | object ) {
    const alert = this.modalCtrl.create(ConfirmLogin, {"iss": iss, "issName": issName, "cbu": cbu, "as": as});
    alert.present();
  }

  private authProtocol(verifiedToken: string|object, secret: string) {
    let alastriaSession;

    if (verifiedToken){
      alastriaSession = this.tokenSrv.getSessionToken(verifiedToken);
      this.showAlert(verifiedToken["iss"], "SERVICE PROVIDER", verifiedToken["cbu"], alastriaSession);
    
    }else{
      this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
    }
  }

  private credentialProtocol(verifiedToken: string|object, secret: string) {
    let alastriaSession;

    if (verifiedToken){
      alastriaSession = this.tokenSrv.getSessionToken(verifiedToken);
      this.showAlert(verifiedToken["iss"], "SERVICE PROVIDER", verifiedToken["cbu"], alastriaSession);
    
    }else{
      this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
    }
  }
}
