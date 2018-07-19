import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  templateUrl: 'camera.html',
  providers: [TabsService, ToastService]
})
export class Camera {

  qrCode: string;
  data: any = {};
  cameraEnabled: boolean = true;

  constructor(private toastCtrl: ToastService, public barcodeScanner: BarcodeScanner) {
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
      console.log('Barcode data', barcodeData.text);
      this.toastCtrl.presentToast("Barcode: " + barcodeData.text);
      this.qrCode = barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
      this.qrCode = "hola";
      this.toastCtrl.presentToast("Error: " + err);
    });
  }

}
