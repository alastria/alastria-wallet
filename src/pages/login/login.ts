import { Component, Input } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ContructionsPage } from '../contructions/contructions';

@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html',
    styleUrls: ['/login.scss']
})
export class Login {
    @Input() data: any;
    @Input() events: any;

    user: string;
    pass: string;

    private isCamera: boolean = false;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;

    constructor(
        public barcodeScanner: BarcodeScanner,
        public modalCtrl: ModalController
    ) {

        this.user = '';
        this.pass = '';
    }

    scanBarcode() {
        if (this.isCamera) {

        }
        this.isCamera = true;
        let options = {
            prompt: "Situe el código Qr en el interior del rectángulo.",
            formats: "QR_CODE"
        }
        this.barcodeScanner.scan(options).then(barcodeData => {
            this.onEvent("onLogin");
        }).catch(err => {
            if (err === "cordova_not_available") {
                this.onEvent("onLogin");
            }
        });

    }

    onEvent = (event: string): void => {
        if (event == "onLogin" && !this.validate()) {
            return;
        }
        if (this.events[event]) {

            this.events[event]({
                'username': this.user,
                'password': this.pass
            });
        }
    }

    validate(): boolean {
        this.isUsernameValid = true;
        this.isPasswordValid = true;

        return this.isPasswordValid && this.isUsernameValid;
    }

    openPage(page: string) {
        let modal = this.modalCtrl.create(InfoPage, { title: page });
        modal.present();
    }

    navegateTo(text: string) {
        let modal = this.modalCtrl.create(ContructionsPage);

        modal.present();
        console.log('Navigating to page: ' + text);
    }

}

@Component({
    selector: 'info',
    templateUrl: 'info.html',
    styleUrls: ['/info.scss']
})
export class InfoPage {

    title: string;

    constructor(
        public viewCtrl: ViewController,
        params: NavParams
    ) {
        this.title = params.get('title');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
