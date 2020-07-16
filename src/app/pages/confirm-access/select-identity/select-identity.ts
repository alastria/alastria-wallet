import { Component, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { IdentityDataListComponent } from '../../../components/identity-data-list/identity-data-list';
import { ActivatedRoute } from '@angular/router';

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
    securedCredentials: any;
    iat: any;
    exp: any;

    constructor(
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private activatedRoute: ActivatedRoute,
    ) {
        this.securedCredentials = this.navParams.get('securedCredentials');
        this.allCredentials = this.navParams.get('allCredentials');
        this.allCredentials = this.allCredentials.map((credential) => {
            credential.isSelectIdentity = true;

            return credential;
        });
        this.iat = this.navParams.get('iat');
        this.exp = this.navParams.get('exp');
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
            credential: this.allCredentials[this.identityDataList.chosenIndex],
            mock: this.selectedMockCredential
        };

        this.modalCtrl.dismiss(result);
    }

    cancel() {
        this.modalCtrl.dismiss();
    }
}
