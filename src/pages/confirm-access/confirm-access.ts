import { Component } from '@angular/core';
import { ViewController, NavParams, NavController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { SuccessPage } from '../success/success';
import { ToastService } from '../../services/toast-service';


@Component({
  selector: 'confirm-access',
  templateUrl: 'confirm-access.html'
})
export class ConfirmAccess {

    public dataNumberAccess: number;
    public issName: string;
    identitySelected: Array<number> = [];

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams, 
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastService
    ) {
        this.dataNumberAccess = this.navParams.get("dataNumberAccess");
        this.issName = this.navParams.get("issName");
    }

    public dismiss(){
        this.navCtrl.setRoot(TabsPage);
        this.viewCtrl.dismiss();
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    public sendAuthentication() {
        if (this.identitySelected.length > 0){
            console.log('Sending Credentials');
            this.showLoading();
            this.viewCtrl.dismiss();
        }else{
            this.toastCtrl.presentToast("Por favor seleccione al menos una credential para enviar",3000);
        }
    }

    public handleIdentitySelect(identitySelect: any) {
        if (identitySelect && identitySelect.value) {
            this.identitySelected.push(identitySelect.id);
        } else {
            this.identitySelected = this.identitySelected.filter(identity => (identity !== identitySelect.id));
        }

        console.log(this.identitySelected);
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
