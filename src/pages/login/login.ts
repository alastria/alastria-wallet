import { Component, Input } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams, NavController, Config } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ContructionsPage } from '../contructions/contructions';
import { SessionSecuredStorageService } from '../../services/securedStorage.service';
import { HomePage } from '../home/home';
import { AppConfig } from "../../app.config";
import { TransactionService } from '../../services/transaction-service';

@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html',
    styleUrls: ['/login.scss']
})
export class Login {
    @Input() data: any;
    @Input() events: any;
    //export PATH=$PATH:/home/agomez/.gradle/wrapper/dists/gradle-5.1.1-all/97z1ksx6lirer3kbvdnh7jtjg/gradle-5.1.1/bin

    user: string;
    pass: string;

    private isCamera: boolean = false;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;

    constructor(
        public barcodeScanner: BarcodeScanner,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public sessionSecuredStorageService: SessionSecuredStorageService,
        private transactioService: TransactionService
    ) {

        this.user = '';
        this.pass = '';

        console.log("Initializing Example of Contract Manager");
    }

    private init() {
        let credentialSubject = {};
        credentialSubject[AppConfig.credentialKey] = AppConfig.credentialValue;
        credentialSubject["levelOfAssurance"] = "basic";
        this.transactioService.addSubjectCredential(AppConfig.kidCredential, AppConfig.didIsssuer, AppConfig.subjectAlastriaID, AppConfig.context, credentialSubject, AppConfig.tokenExpTime, AppConfig.tokenActivationDate, AppConfig.jti, AppConfig.uri)
        .then(result => {
            console.log("The final result is " + JSON.stringify(result));
            return this.transactioService.getSubjectCredentialList(AppConfig.subject);
        }).then(res => {
            console.log("The list is ", res);
        });
    }

    /*TODO: NO SE LLAMA NUNCA, cambiar de sitio */
    scanBarcode() {
        if (this.isCamera) {

        }
        this.isCamera = true;
        let options = {
            prompt: "Situe el código Qr en el interior del rectángulo.",
            formats: "QR_CODE"
        }

        /* Comprobamos si el usuario esta registrado */
        this.sessionSecuredStorageService.isRegistered()
            .then(
                (result) => {
                    /* Comprobar si el usuario coincide */
                    this.navCtrl.setRoot(HomePage);
                }
            )
            .catch(
                (error) => {
                    /* TODO Cambiar esto para la version final */
                    if (error === "cordova_not_available") {
                        this.navCtrl.setRoot(HomePage);
                    }

                    console.log(error)
                }
            );

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
