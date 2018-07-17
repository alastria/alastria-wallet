import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Camera } from '../camera/camera';
import { QRScanner, QRScannerStatus } from '../../../node_modules/@ionic-native/qr-scanner';

@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class Login {
    @Input() data: any;
    @Input() events: any;

    private isCamera:boolean = false;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;
  
    constructor(public qr: QRScanner) {
        
    }

    scanBarcode() {
        if(this.isCamera){
            this.hideCamera();
            this.qr.hide();
            this.onEvent("onLogin");
        }
        this.isCamera = true;
        this.qr.prepare().then((status: QRScannerStatus) => {
            if (status.authorized) {
              // W00t, you have camera access and the scanner is initialized.
              // QRscanner.show() should feel very fast.
              this.showCamera()
              let scan = this.qr.scan().subscribe(text => {
                alert(text);
                this.hideCamera();
                this.qr.hide();
                this.onEvent("onLogin");
                scan.unsubscribe();
              }, err => {
                alert(err);
                this.hideCamera();
              });
              window.document.querySelector('ion-app').classList.add('transparentBody')
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
          }).catch((e: any) => {
            this.onEvent("onLogin");
            console.log('Error is', e)
          });
    }

    showCamera() {    
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }
    hideCamera() {    
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    }

    onEvent = (event: string): void => {
        if (event == "onLogin" && !this.validate()) {
            return ;
        }
        if (this.events[event]) {

            this.events[event]({
                'username' : "demo",
                'password' : "demo"
            });
        }
      }
    
    validate():boolean {
        this.isUsernameValid = true;
        this.isPasswordValid = true;

        // if (!this.username ||this.username.length == 0) {
        //     this.isUsernameValid = false;
        // }
    
        // if (!this.password || this.password.length == 0) {
        //     this.isPasswordValid = false;
        // }
        return this.isPasswordValid && this.isUsernameValid;
     }
}
