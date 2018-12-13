import { Component, Input } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';


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

    fingerprintOptions: FingerprintOptions;

    constructor(public barcodeScanner: BarcodeScanner,
        public modalCtrl: ModalController,
        private secureStorage: SecureStorage,
        private faio: FingerprintAIO,
        private platform: Platform) {

        /*      this.fingerprintOptions = {
                  clientId: 'fingerprint-demo',
                  clientSecret: 'password', //Only necessary for Android
                  disableBackup: true, //Only for Android(optional)
                  localizedFallbackTitle: 'Use Pin', //Only for iOS
                  localizedReason: 'Please authenticate' //Only for iOS
              }
              */

        this.user = '';
        this.pass = '';
    }

    regFinger() {
        this.faio.isAvailable().then(result => {
            this.faio.show({
                clientId: "AlastriaID",
                clientSecret: "NddAHBODmhACXHITWJTU",
                disableBackup: true,
                localizedFallbackTitle: 'Touch ID for AlastriaID', //Only for iOS
            }).then(result => {
                this.onEvent("onLogin");
            }).catch(err => {

            });
        }).catch(err => {
            if (err === "cordova_not_available") {
                this.onEvent("onLogin");
            }
        });
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
            this.secureStorage.create('secureStorageName2')
                .then((storage: SecureStorageObject) => {
                    storage.keys().then(keys => {
                        if (keys.length == 0) {
                            alert("No items found in secure storage");
                            var key = 'testkey';
                            var value = "testValue"
                            storage.set(key, value).then(
                                data => alert("Added value " + value + " for key " + data + " in secure storage "),
                                error => alert(error)
                            );
                        } else {
                            var a = keys.length + " Key/value pairs found in secure storage: \n";
                            var results = new Array<Promise<String>>();
                            for (let key of keys) {
                                results.push(storage.get(key));
                            }

                            Promise.all(results).then(values => {
                                var i = 0;
                                for (var value of values) {
                                    a = a + keys[i] + " => " + value;
                                    i++;
                                }
                                alert(a);
                                storage.clear();
                                alert("Removed all secure storage content");
                            });
                        }
                    });
                }).catch(err => {

                });
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


