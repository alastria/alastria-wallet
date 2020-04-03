import { EntitiesPage } from './../entities/entities';
import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController, App } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { getNav } from '../../utils';
import { SecuredStorageService } from '../../services/securedStorage.service';

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
        private secureStrg: SecuredStorageService,
        private app: App
    ) {
        this.error = this.navParams.get('error');
        this.pageName = this.navParams.get('pageName');
    }

    async dismiss(){
        try {
            const nav = getNav(this.app);

            if(this.pageName === 'TabsPage' || this.pageName === 'Camera' || this.pageName === 'Index') {
                nav.setRoot(TabsPage);
                this.viewCtrl.dismiss();
            } else if (this.pageName === 'EntitiesPage') {                
                nav.setRoot(TabsPage);
                nav.push(EntitiesPage);
                this.viewCtrl.dismiss();
            } else {
                const views = this.app.getRootNav().getViews();
                if (nav && nav._views.length > 1) { 
                    nav.pop();
                } else {
                    const DID = await this.secureStrg.getDID();
                    if (DID) {
                        nav.setRoot(TabsPage);
                    }
                    this.viewCtrl.dismiss();
                }
            }
        } catch(error) {
            console.error(error);
        }
    }
}
