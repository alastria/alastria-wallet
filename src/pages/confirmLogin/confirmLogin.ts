import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { sign } from 'jsonwebtoken';
import { SuccessPage } from '../success/success';
import { TabsPage } from '../tabsPage/tabsPage';

@IonicPage()
@Component({
    selector: 'page-confirmLogin',
    templateUrl: 'confirmLogin.html',
})
export class ConfirmLogin {

    public iss: string;
    public issName: string;
    public cbu: string;
    public as: string | object;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        public http : HttpClient
    ) {
        this.iss = this.navParams.get("iss");
        this.issName = this.navParams.get("issName");
        this.cbu = this.navParams.get("cbu");
        this.as = this.navParams.get("as");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmLoginPage');
    }

    public dismiss(){
        this.navCtrl.setRoot(TabsPage);
        this.viewCtrl.dismiss();
    }

    public sendAuthentication() {
        console.log("Sending authetication");
        let secret = "your-256-bit-secret";
        let signedJWT = {
            "token": sign(this.as,secret)
        };
        console.log("sending token");
        
        let head = new HttpHeaders();
        head.set("Content-Type", "application/json");
        this.http.post(this.cbu, this.as, {headers: head}).subscribe((data) => {
            this.showLoading();
            this.viewCtrl.dismiss();
        });
    }

    public showLoading() {
        let titleSuccess = 'Estamos <strong>actualizando tu AlastriaID</strong>';
        let textSuccess = 'Solo será un momento';
        let imgPrincipal = 'assets/images/alastria/loading.png';
        let imgSuccess = '';
        let page = "loading";

        let modal = this.modalCtrl.create(SuccessPage, { 
            titleSuccess: titleSuccess, 
            textSuccess: textSuccess, 
            imgPrincipal: imgPrincipal, 
            imgSuccess: imgSuccess, 
            page: page, 
            callback: "success" });
        modal.present();
    }
}
