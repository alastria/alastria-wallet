import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
})
export class SuccessPage {

    data = {};
    isDeeplink: any = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.data = {
            titleSuccess: this.activatedRoute.snapshot.paramMap.get('titleSuccess'),
            textSuccess: this.activatedRoute.snapshot.paramMap.get('textSuccess'),
            imgPrincipal: this.activatedRoute.snapshot.paramMap.get('imgPrincipal'),
            imgSuccess: this.activatedRoute.snapshot.paramMap.get('imgSuccess'),
            page: this.activatedRoute.snapshot.paramMap.get('page'),
            callback: this.activatedRoute.snapshot.paramMap.get('callback'),
        };

        this.isDeeplink = this.activatedRoute.snapshot.paramMap.get('isDeeplink');
    }

    public closeModal() {
        this.router.navigateByUrl('/tabs');
    }
}
