import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../app.config';

// SERVICE
import { MessageManagerService } from '../../../services/messageManager-service';
import { ToastService } from '../../../services/toast-service';

// COMPONENTS - PAGES
import { ConfirmErrorPage } from '../../confirmError/confirmError';

@Component({
    templateUrl: 'camera.html',
    providers: [ToastService],
    styleUrls: ['/camera.scss']
})

export class CameraPage {

    data: any = {
        title: 'Cámara',
        format: 'Escaneo de QRCodes blockchain',
        text: 'Desde aquí puede leer códigos blockchain formateados como QRCode. Utilice la cámara de su dispositivo.'
    };
    cameraEnabled = true;
    file: File;

    constructor(
        public barcodeScanner: BarcodeScanner,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private messageManagerService: MessageManagerService) {
    }


    ionViewWillEnter() {
        const pageName = this.activatedRoute.snapshot.paramMap.get('token');
        const options = {
            prompt: 'Situe el código Qr en el interior del rectángulo.',
            formats: AppConfig.QR_CODE
        };

        this.barcodeScanner.scan(options).then(async barcodeData => {
            const alastriaToken = barcodeData.text;
            if (barcodeData.text && !barcodeData.cancelled) {
                const alastriTokenPrepared = alastriaToken.replace(/['"]+/g, '')
                if (alastriTokenPrepared.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi)) {
                    this.http.get(alastriTokenPrepared).subscribe((data: any) => {
                        const dataStringified = (data.jwt) ? data.jwt : JSON.stringify(data);
                        this.messageManagerService.prepareDataAndInit(dataStringified)
                            .catch((error) => {
                                throw error;
                            });
                    }, (error) => {
                        this.showConfirmEror('Error: Contacte con el service provider', pageName);
                    });
                } else {
                    this.messageManagerService.prepareDataAndInit(alastriaToken)
                        .catch((error) => {
                            this.showConfirmEror('Error: Contacte con el service provider', pageName);
                        });
                }
            } else {
                if (!barcodeData.cancelled) {
                    this.showConfirmEror('Error: Contacte con el service provider', pageName);
                }
            }
        }).catch((error) => {
            this.showConfirmEror();
        });
    }

    private async showConfirmEror(message?: string, pageName?: string) {
        const error = {
            message: message ? message : 'Error: Contacte con el service provider'
        };
        const modal = await this.modalCtrl.create({
            component: ConfirmErrorPage,
            componentProps: { error, pageName }
          });

        return await modal.present();
    }
}
