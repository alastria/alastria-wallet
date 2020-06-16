import { Component, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { IdentityDataListComponent } from '../../../components/identity-data-list/identity-data-list';

@Component({
    selector: 'select-identity',
    templateUrl: 'select-identity.html'
})
export class SelectIdentity {
    @ViewChild(forwardRef(() => IdentityDataListComponent))
    identityDataList: IdentityDataListComponent;

    @Output() handleSelectNewCredential = new EventEmitter();

    searchTerm = "";
    selectedMockCredential: any;
    allCredentials: any[];
    iat: any;
    exp: any;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
    ) {
        this.allCredentials = navParams.get("allCredentials");
        this.iat = this.navParams.get("iat");
        this.exp = this.navParams.get("exp");
    }

    onSearch(event?: any) {
        for (let credential of this.identityDataList.identityDisplay) {
            if (credential.titleP.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
                || credential.value.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
                credential.isHidden = false;
            } else {
                credential.isHidden = true;
            }
        }
    }

    handleIdentitySelect(event: any) {
        if (event && event.value) {
            this.selectedMockCredential = event.data;
        } else {
            this.selectedMockCredential = undefined;
        }
    }

    sortCredentials() {
        for (let credential of this.identityDataList.identityDisplay) {
            credential.id = this.identityDataList.identityDisplay.length - credential.id - 1;
        }
        this.identityDataList.identityDisplay.reverse();
    }

    accept() {
        const result: any = {
            credential: this.identityDataList.credentials[this.identityDataList.chosenIndex],
            mock: this.selectedMockCredential
        }
        this.navCtrl.pop().then(() => this.navParams.get("resolve")(result))
    }

    cancel() {
        this.navCtrl.pop();
    }
}
