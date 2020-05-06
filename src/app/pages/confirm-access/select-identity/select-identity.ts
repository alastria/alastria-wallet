import { Component, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { IdentityDataListComponent } from '../../../components/identity-data-list/identity-data-list';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'select-identity',
    templateUrl: 'select-identity.html',
    styleUrls: ['/select-identity.scss']
})
export class SelectIdentityPage {
    @ViewChild(forwardRef(() => IdentityDataListComponent), { read: '', static: false})
    identityDataList: IdentityDataListComponent;

    @Output() handleSelectNewCredential = new EventEmitter();

    searchTerm = '';
    selectedMockCredential: any;
    allCredentials: any;
    iat: any;
    exp: any;

    constructor(
        private router: Router,
        public navParams: NavParams,
        public navCtrl: NavController,
        private activatedRoute: ActivatedRoute
    ) {
        this.allCredentials = this.activatedRoute.snapshot.paramMap.get('allCredentials');
        this.iat = this.activatedRoute.snapshot.paramMap.get('iat');
        this.exp = this.activatedRoute.snapshot.paramMap.get('exp');
    }

    onSearch(event?: any) {
        for (const credential of this.identityDataList.identityDisplay) {
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
        for (const credential of this.identityDataList.identityDisplay) {
            credential.id = this.identityDataList.identityDisplay.length - credential.id - 1;
        }
        this.identityDataList.identityDisplay.reverse();
    }

    accept() {
        const result: any = {
            credential: this.identityDataList.credentials[this.identityDataList.chosenIndex],
            mock: this.selectedMockCredential
        };
        this.navCtrl.back();
        // this.navCtrl.pop().then(() => this.navParams.get('resolve')(result));
    }

    cancel() {
        this.navCtrl.back();
    }
}
