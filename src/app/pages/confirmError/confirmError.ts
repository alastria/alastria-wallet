import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { SecuredStorageService } from '../../services/securedStorage.service';

@Component({
    selector: 'page-confirmError',
    templateUrl: 'confirmError.html',
})
export class ConfirmErrorPage {

    error: any;
    pageName: string;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private secureStrg: SecuredStorageService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.error = this.activatedRoute.snapshot.paramMap.get('errors');
        this.pageName = this.activatedRoute.snapshot.paramMap.get('pageName');
    }

    async dismiss() {
        try {
            if (this.pageName === 'TabsPage' || this.pageName === 'Camera' || this.pageName === 'Index') {
                this.router.navigateByUrl('/tabs');
            } else if (this.pageName === 'EntitiesPage') {
                this.router.navigateByUrl('/entities');
            } else {
                this.navCtrl.back();
                // if (nav && nav._views.length > 1) {
                //     nav.pop();
                //     this.na
                // } else {
                //     const DID = await this.secureStrg.getDID();
                //     if (DID) {
                //         nav.setRoot(TabsPage);
                //     }
                //     this.viewCtrl.dismiss();
                // }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
