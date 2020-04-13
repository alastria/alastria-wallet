import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, App } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { getNav } from '../../utils';


@IonicPage()
@Component({
    selector: 'page-success',
    templateUrl: 'success.html',
})
export class SuccessPage {

    data = {};
    isDeeplink = false;

    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private app: App
    ) {
        this.data = {
            'titleSuccess': this.navParams.get('titleSuccess'),
            'textSuccess': this.navParams.get('textSuccess'),
            'imgPrincipal': this.navParams.get('imgPrincipal'),
            'imgSuccess': this.navParams.get('imgSuccess'),
            'page': this.navParams.get('page'),
            'callback': this.navParams.get('callback')
        };

        this.isDeeplink = this.navParams.get('isDeeplink');
    }

    public closeModal() {
        const nav = getNav(this.app);
        this.viewCtrl.dismiss();

        if (this.isDeeplink) {
            nav.popTo(TabsPage)
        } else {
            nav.setRoot(TabsPage);
        }
    }
}
