import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  templateUrl: 'camera.html',
  providers: [TabsService, ToastService]
})
export class Camera {

  data: any = {};
  qr: QRScanner;
  cameraEnabled: boolean = true;

  constructor( qr: QRScanner, private toastCtrl: ToastService ) {
    this.data = {
      title: "Cámara",
      format: "Escaneo de QRCodes blockchain",
      text: "Desde aquí puede leer códigos blockchain formateados como QRCode. Utilice la cámara de su dispositivo."
    }
    
    qr.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        // W00t, you have camera access and the scanner is initialized.
        // QRscanner.show() should feel very fast.
        this.showCamera()
        qr.scan().subscribe(text => {
          alert(text);
          this.hideCamera();
        }, err => {
          alert(err);
          this.hideCamera();
        });
        window.document.querySelector('ion-app').classList.add('transparentBody')
        qr.show();
      } else if (status.denied) {
       // The video preview will remain black, and scanning is disabled. We can
       // try to ask the user to change their mind, but we'll have to send them
       // to their device settings with `QRScanner.openSettings()`.
      } else {
        // we didn't get permission, but we didn't get permanently denied. (On
        // Android, a denial isn't permanent unless the user checks the "Don't
        // ask again" box.) We can ask again at the next relevant opportunity.
      }
    }).catch((e: any) => {
      this.cameraEnabled = false;
      this.toastCtrl.presentToast(e);
      console.log('Error is', e)
    });

  }

  showCamera() {    
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  hideCamera() {    
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

}
