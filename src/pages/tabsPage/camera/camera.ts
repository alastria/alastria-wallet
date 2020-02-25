import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { AppConfig } from '../../../app.config';

// SERVICE
import { MessageManagerService } from '../../../services/messageManager-service';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';

// COMPONENTS - PAGES
import { ConfirmError } from '../../confirmError/confirmError';
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

    constructor(
        public barcodeScanner: BarcodeScanner,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        private http: HttpClient,
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
                    this.showConfirmEror("Error: Contacte con el service provider");
                });
            } else {
                this.msgManagerSrv.prepareDataAndInit(alastriaToken)
                    .catch((error) => {
                        this.showConfirmEror("Error: Contacte con el service provider");
                    });
            }

        }).catch(err => {
            this.showConfirmEror();
        });
    }

    private showConfirmEror(message?: string) {
        const error = {
            message: message ? message : "Error: Contacte con el service provider"
        };
        const alert = this.modalCtrl.create(ConfirmError, { 'error': error });
        alert.present();
    }
}
