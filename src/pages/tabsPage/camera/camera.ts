import { TabsPage } from './../tabsPage';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalController, NavController, NavParams } from 'ionic-angular';
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
        private navParams: NavParams,
        private http: HttpClient,
        private messageManagerService: MessageManagerService) {
            console.log('------ CAMERA ------')
        let pageName = this.navParams.get('pageName');
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
                        this.showConfirmEror("Error: Contacte con el service provider", pageName);
                    });
                } else {
                    this.messageManagerService.prepareDataAndInit(alastriaToken)
                        .catch((error) => {
                            this.showConfirmEror("Error: Contacte con el service provider", pageName);
                        });
                }
            } else {
                if (!pageName) {
                    pageName = this.getPageName();
                }
                if (pageName === 'TabsPage' || pageName === 'Camera' || pageName === 'Index') {
                    this.showConfirmEror("Error: Contacte con el service provider", pageName);
                }
            }
        }).catch((error) => {
            this.showConfirmEror();
        });
    }

    private showConfirmEror(message?: string, pageName?: string) {
        const error = {
            message: message ? message : "Error: Contacte con el service provider"
        };
        if (!pageName) {
            pageName = this.getPageName();
        }
        const alert = this.modalCtrl.create(ConfirmError, { 'error': error, 'pageName': pageName });
        alert.present();
    }

    private getPageName() {
        const currentStack = this.navCtrl.getViews();
        return (currentStack.length) ? (currentStack[currentStack.length - 1]) ? currentStack[currentStack.length - 1].name : (currentStack[0]) ? currentStack[0].name  : '' : '';
    }
}
