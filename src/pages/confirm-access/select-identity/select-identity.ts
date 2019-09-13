import { Component, Output, EventEmitter } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { IdentitySecuredStorageService } from '../../../services/securedStorage.service';


@Component({
    selector: 'select-identity',
    templateUrl: 'select-identity.html'
})
export class SelectIdentity {
    @Output() handleSelectNewCredential = new EventEmitter();

    private readonly CREDENTIAL_PREFIX = "cred_";
    private readonly PRESENTATION_PREFIX = "present_";

    private identitySelected: Array<number> = [];
    private credentials: Array<any>;

    public searchTerm: string;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
    ) { }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    onSearch(event?: any) {
        console.log('Event ', event);
        console.log('searchTerm', this.searchTerm);
    }

    handleIdentitySelect(event: any) {
        console.log('handleIdentitySelect ', event);
    }

    accept() {
        this.handleSelectNewCredential.emit(this.identitySelected);
        this.navCtrl.pop();
    }

    cancel() {
        this.navCtrl.pop();
    }
}
