import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalController, NavController } from 'ionic-angular';
import { AppConfig } from '../../../app.config';

// SERVICE
import { MessageManagerService } from '../../../services/messageManager-service';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { SecuredStorageService } from '../../../services/securedStorage.service';

// COMPONENTS - PAGES
import { ConfirmError } from '../../confirmError/confirmError';
import { EntitiesPage } from '../../entities/entities';

@IonicPage()
@Component({
    templateUrl: 'camera.html',
    providers: [ToastService]
})

export class Camera {

    data: any = {
        title: "Cámara",
        format: "Escaneo de QRCodes blockchain",
        text: "Desde aquí puede leer códigos blockchain formateados como QRCode. Utilice la cámara de su dispositivo."
    };
    cameraEnabled = true;
    file: File;

    constructor(
        public barcodeScanner: BarcodeScanner,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        private securedStrg: SecuredStorageService,
        private http: HttpClient,
        private messageManagerService: MessageManagerService) {
        let options = {
            prompt: "Situe el código Qr en el interior del rectángulo.",
            formats: AppConfig.QR_CODE
        }

        this.barcodeScanner.scan(options).then(async barcodeData => {
            let alastriaToken = barcodeData.text;
            if (barcodeData.text && !barcodeData.cancelled) {
                if (alastriaToken.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi)) {
                    this.http.get(alastriaToken).subscribe(data => {
                        this.messageManagerService.prepareDataAndInit(data)
                            .catch((error) => {
                                throw error;
                            })
                    }, (error) => {
                        console.error(error);
                        this.showConfirmEror("Error: Contacte con el service provider");
                    });
                } else {
                    this.messageManagerService.prepareDataAndInit(alastriaToken)
                        .catch((error) => {
                            console.error(error);
                            this.showConfirmEror("Error: Contacte con el service provider");
                        });
                }
            } else {
                try {
                    const DID = await this.securedStrg.hasKey(AppConfig.USER_DID);
        
                    if (DID) {
                        this.showConfirmEror("Error: Contacte con el service provider");
                    } else {
                        this.navCtrl.setRoot(EntitiesPage);
                    }
                } catch(error) {
                    console.error(error);
                }
            }
        }).catch((error) => {
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
