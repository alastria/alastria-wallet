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

  constructor( qr: QRScanner ) {
    this.data = {
      title: "Cámara",
      format: "Format",
      text: "Text"
    }
    
    qr.prepare().then(this.onDone).catch((e: any) => console.log('Error is', e));

  }

  private onDone(status: QRScannerStatus){
    if (status.authorized) {
      // W00t, you have camera access and the scanner is initialized.
      // QRscanner.show() should feel very fast.
      this.qr.scan().subscribe(text => {
        alert(text);
      }, err => {
        alert(err);
      });
      this.qr.show();
    } else if (status.denied) {
     // The video preview will remain black, and scanning is disabled. We can
     // try to ask the user to change their mind, but we'll have to send them
     // to their device settings with `QRScanner.openSettings()`.
    } else {
      // we didn't get permission, but we didn't get permanently denied. (On
      // Android, a denial isn't permanent unless the user checks the "Don't
      // ask again" box.) We can ask again at the next relevant opportunity.
    }
  }

}
