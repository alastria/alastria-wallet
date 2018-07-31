import { Component, Input } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';


@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html',
    styleUrls: ['/login.scss']
})
export class Login {
    @Input() data: any;
    @Input() events: any;

    private isCamera: boolean = false;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;

    constructor(public barcodeScanner: BarcodeScanner, public modalCtrl: ModalController, private secureStorage: SecureStorage) {

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
                        for (var key of keys) {
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


