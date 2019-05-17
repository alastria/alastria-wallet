import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { verify } from 'jsonwebtoken';
import { ConfirmLogin } from '../../confirmLogin/confirmLogin';
import { Index } from '../index';

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
    public modalCtrl: ModalController) {
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

      let verifyJWT = verify(alastriaToken, secret, { algorithms: ['HS256'] });

      let currDate: any = new Date();
      currDate = currDate.getTime();

      let iss = verifyJWT["iss"];
      let issName;
      let cbu;

      if (iss){
        console.log(verifyJWT);
        issName = "SERVICE PROVIDER";
        cbu = verifyJWT["cbu"];

        let alastriaSession = {
          "iss": "did:ala:quor:telsius:0x123ABC",
          "pku": secret,
          "iat": currDate,
          "exp": currDate + 5 * 60 * 1000,
          "nbf ": currDate,
          "data": verifyJWT
        }
      
        this.showAlert(iss, issName, cbu, alastriaSession);
      }else{
        this.toastCtrl.presentToast("Error: Contacte con el service provider", 1000);
      }

    }).catch(err => {
      console.log('Error', err);
      this.qrCode = "hola";
      this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
      this.navCtrl.setRoot(Index);
    });
  }

  showAlert(iss: string, issName: string, cbu: string, as: string | object ) {
    const alert = this.modalCtrl.create(ConfirmLogin, {"iss": iss, "issName": issName, "cbu": cbu, "as": as});
    alert.present();
  }

}
