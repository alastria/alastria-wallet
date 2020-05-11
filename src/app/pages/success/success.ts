import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
    styleUrls: ['/success.scss']
})
export class SuccessPage {

    data = {};
    isDeeplink: any = false;

    constructor(
        private router: Router,
        private navParams: NavParams
    ) {
        this.data = {
            titleSuccess: this.navParams.get('titleSuccess'),
            textSuccess: this.navParams.get('textSuccess'),
            imgPrincipal: this.navParams.get('imgPrincipal'),
            imgSuccess: this.navParams.get('imgSuccess'),
            page: this.navParams.get('page'),
            callback: this.navParams.get('callback'),
        };

        console.log('data ', this.data);

        this.isDeeplink = navParams.get('isDeeplink');
    }

    public closeModal() {
        this.router.navigateByUrl('/tabs');
    }
}
