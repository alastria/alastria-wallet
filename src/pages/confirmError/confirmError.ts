import { EntitiesPage } from './../entities/entities';
import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController, App } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';

@Component({
    selector: 'page-confirmError',
    templateUrl: 'confirmError.html',
})
export class ConfirmError {

    error: any;
    pageName: string;

    constructor(
        public navParams: NavParams, 
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        private app: App
    ) {
        this.error = this.navParams.get('error');
        this.pageName = this.navParams.get('pageName');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmErrorPage');
    }

    async dismiss(){
        try {
            console.log('pageName ', this.pageName);
            if(this.pageName === 'TabsPage' || this.pageName === 'Camera' || this.pageName === 'Index') {
                this.app.getRootNav().setRoot(TabsPage);
                this.viewCtrl.dismiss();
            } else if (this.pageName === 'EntitiesPage') {                
                this.app.getRootNav().setRoot(TabsPage);
                this.app.getRootNav().push(EntitiesPage);
                this.viewCtrl.dismiss();
            } else {
                this.app.getRootNav().pop();
            }
        } catch(error) {
            console.error(error);
        }
    }
}
