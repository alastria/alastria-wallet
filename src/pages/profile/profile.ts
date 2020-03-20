import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SecuredStorageService } from '../../services/securedStorage.service';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    credentials: Array<any> = [];
    searchTerm: string;

    constructor(private securedStrg: SecuredStorageService) {
        this.getAllCredentials();
    }

    /**
     * Search activities fake
     * @param {string} event
     * @param {*} item
    */
   async onSearch(event?: any) {
        let searchTerm = this.searchTerm;
        if (event) {
            searchTerm = event.target.value;
        }

        try {
            await this.getAllCredentials();
            if (searchTerm) {
                this.credentials = this.credentials.filter(credential => {
                    const credentialJson = JSON.parse(credential);
                    const coincidenceKeys = Object.keys(credentialJson).filter(key => key.indexOf(searchTerm.toLowerCase()) !== -1);
                    const coincidenceValues = Object.values(credentialJson).filter(value => (value) ? value.toString().indexOf(searchTerm.toLowerCase()) !== -1 : null);

                    if ((coincidenceKeys && coincidenceKeys.length) || (coincidenceValues && coincidenceValues.length)) {
                        return credential;
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    private async getAllCredentials(): Promise<void> {
        this.credentials = [];
        this.credentials = await this.securedStrg.getAllCredentials()
    }
}
