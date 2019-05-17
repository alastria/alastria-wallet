import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConfirmAccessComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'confirm-access',
  templateUrl: 'confirm-access.html'
})
export class ConfirmAccessComponent {

    public dataNumberAccess: number;
    public issName: string;
    identitySelected: Array<number> = [];

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams, 
    ) {
        this.dataNumberAccess = this.navParams.get("dataNumberAccess");
        this.issName = this.navParams.get("issName");
    }

    public dismiss(){
        this.viewCtrl.dismiss();
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    sendAuthentication() {
        console.log('Send Authentication');
        this.viewCtrl.dismiss();
    }

    handleIdentitySelect(identitySelect: any) {
        if (identitySelect && identitySelect.value) {
            this.identitySelected.push(identitySelect.id);
        } else {
            this.identitySelected = this.identitySelected.filter(identity => (identity !== identitySelect.id));
        }

        console.log(this.identitySelected);
    }
}
