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

    private readonly CREDENTIAL_PREFIX = "cred_";
    private readonly PRESENTATION_PREFIX = "present_";

    private identityReplaced: number;
    private selectedMockCredential: any;

    public searchTerm = "";

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
    ) {
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    onSearch(event?: any) {
        console.log('Event ', event);
        console.log('searchTerm', this.searchTerm);
        try {
            this.identityDataList.identityDisplay = this.identityDataList.identityData.filter(mock => {
                if (mock.titleP.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
                    || mock.value.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
                    return mock;
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    handleIdentitySelect(event: any) {
        if (event && event.value) {
            this.selectedMockCredential = event.data;
        } else {
            this.selectedMockCredential = undefined;
        }
        console.log('Selected Credential: ', this.selectedMockCredential);
    }

    sortCredentials() {
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
