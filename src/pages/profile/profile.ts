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
                    const coincidence = Object.keys(credentialJson).filter(key => {
                        if (key !== 'levelOfAssurance' && key !== 'iat' && key !== 'exp' && key !== 'issuer' && key !== 'PSMHash') {
                            if (key.indexOf(searchTerm.toLowerCase()) !== -1 || credentialJson[key].indexOf(searchTerm.toLowerCase()) !== -1) {
                                return credential;
                            }
                        }
                    });

                    if (coincidence && coincidence.length) {
                        return credential;
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    private async getAllCredentials(): Promise<void> {
        this.credentials = [];
        this.credentials = await this.securedStrg.getAllCredentials()
    }
}
