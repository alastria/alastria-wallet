import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { Index } from '../index';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../services/loading-service';
import { MessageManagerService } from '../../../services/messageManager-service';
let Wallet = require('ethereumjs-util');

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
        private http: HttpClient,
        private loadingSrv: LoadingService,
        private msgManagerSrv: MessageManagerService) {
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

            if (httpRegex.test(alastriaToken)) {
                this.http.get(alastriaToken).subscribe(data => {
                    this.msgManagerSrv.prepareDataAndInit(data)
                        .catch((error) => {
                            throw error;
                        })
                }, error => {
                    this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
                    this.navCtrl.setRoot(Index);
                });
            } else {
                this.msgManagerSrv.prepareDataAndInit(alastriaToken)
                    .catch((error) => {
                        this.toastCtrl.presentToast("Error: Contacte con el service provider", 3000);
                        this.navCtrl.setRoot(Index);
                    });
            }

        }).catch(err => {
            this.showErrorToast();
        });
    }

    private showErrorToast(msg?: string) {
        msg = msg ? msg : "Error: Contacte con el service provider";
        this.toastCtrl.presentToast(msg, 3000);
        this.navCtrl.setRoot(Index);
        this.loadingSrv.hide();
    }
}
