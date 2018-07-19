import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class Login {
    @Input() data: any;
    @Input() events: any;

    private isCamera: boolean = false;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;

    constructor(public barcodeScanner: BarcodeScanner) {

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
            console.log('Barcode data', barcodeData.text);
            alert("Barcode data, " + barcodeData.text);
            this.onEvent("onLogin");
        }).catch(err => {
            console.log('Error', err);
            if(err==="cordova_not_available"){
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
                'username': "demo",
                'password': "demo"
            });
        }
    }

    validate(): boolean {
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
