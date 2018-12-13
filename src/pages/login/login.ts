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
        this.faio.isAvailable().then(result =>{
            console.log('1 --> ', result);

            this.faio.show({
                clientId: "AlastriaID",
                clientSecret: "NddAHBODmhACXHITWJTU",
                disableBackup: true,
                localizedFallbackTitle: 'Touch ID for AlastriaID', //Only for iOS
            }).then(result => {
                 console.log('2 --> ', result);
                 this.onEvent("onLogin");
               }).catch(err => {
                 console.error('1 --> ', err);
               });

        }).catch(err => {
        console.error('2 --> ', err);
        if(err==="cordova_not_available"){
            this.onEvent("onLogin");
        }
        });
    }
/*
    async regFinger() {

        try {
            this.platform.ready().then(
                ()=> {
                    this.faio.isAvailable().then(
                        (avaliable) => {
                            console.log('avaliable --> ', avaliable);
                            
                            if (avaliable === 'finger') {
                               this.faio.show(this.fingerprintOptions).then(
                                    (succ) => {
                                        console.log('Ok, estas dentro --> ', succ);
                                    },
                                    (err) => {
                                        console.error('Error en lector de huellas --> ', err);
                                    }
                                );
                            }
                        }
                    );
                },
                (error) => {
                    console.error('Error --> ', error);
                    
                }
            );
            
        } catch (error) {
            console.error('Error en lector de huellas --> ', error);
        }
        
    } */

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
            //alert("Barcode data, " + barcodeData.text);
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
                
            
               /* storage.set('key', 'value')
                 .then(
                  data => alert("Set data in secure storage " + data),
                   error => alert(error)
               );
          
               storage.keys().then(keys => {
                if (keys.length == 0) {
                    alert("No items found in secure storage");
                }
                for (var key of keys) {
                    alert("Key " + key)
                }
            
                }); 
               storage.remove('key')
               .then(
                   data => alert("Removed data from secure storage " + data),
                   error => alert(error)
               );
               storage.keys().then(keys => {
                if (keys.length == 0) {
                    alert("No items found in secure storage");
                }
                for (var key of keys) {
                    alert("Key " + key)
                } */
                
/*                 }); 
 */          
            }).catch(err => {
                console.error('Error 132123', err);

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

        // if (!this.username ||this.username.length == 0) {
        //     this.isUsernameValid = false;
        // }

        // if (!this.password || this.password.length == 0) {
        //     this.isPasswordValid = false;
        // }
        return this.isPasswordValid && this.isUsernameValid;
    }

    openPage(page : string) {

        let modal = this.modalCtrl.create(InfoPage, { title: page });

        modal.present();
        console.log('Navigating to page: ' + page);
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


