import { ActivityM } from './../../models/activity.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecuredStorageService } from '../../services/securedStorage.service';
import { Observable, from } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
    styleUrls: ['/profile.scss']
})
export class ProfilePage {

    credentials: Observable<Array<ActivityM>>;
    searchTerm: string;
    isHaveCredentials: boolean;

    constructor(private securedStrg: SecuredStorageService,
                private router: Router,
                private navController: NavController) {
    }

    ionViewWillEnter() {
        this.credentials = from(this.getAllCredentials()).pipe(map((credentials) => {
            return credentials.map((cred) => JSON.parse(cred));
        }));
        this.credentials.forEach((credentials) => {
            this.isHaveCredentials = (credentials && credentials.length) ? true : false;
        });
    }

    public openUserSettings(): void {
        this.router.navigate(['/', 'settings']);
    }


    /**
     * Search activities fake
     * @param  event - *
     * @param  item - *
     */
   async onSearch(event?: any) {
        let searchTerm = this.searchTerm;
        if (event) {
            searchTerm = event.target.value;
        }

        try {
            await this.getAllCredentials();
            if (searchTerm) {
                this.credentials = this.credentials.pipe(map((credentials) => {
                    const result = credentials.filter((credential: any) => {
                        const credentialJson = JSON.parse(credential);
                        const resultKey = Object.keys(credentialJson).filter(key => {
                            if (key !== 'levelOfAssurance' && key !== 'iat' && key !== 'exp'
                                && key !== 'issuer' && key !== 'PSMHash' && key !== 'nbf'
                                && key !== 'iss' && key !== 'sub' && key !== 'credentialJWT') {
                                    if (key.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
                                        || credentialJson[key].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                        return credentialJson;
                                    }
                            }
                        });
                        if (resultKey && resultKey.length) {
                            return resultKey ;
                        }
                    });

                    return result;
                }));
            } else  {
                this.credentials = from(this.getAllCredentials()).pipe(map((credentials) => {
                    return credentials.map((cred) => JSON.parse(cred));
                }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    async goToEntitiesList(): Promise<any> {
       this.router.navigateByUrl('/entities');
    }

    private async getAllCredentials() {
        return this.securedStrg.getAllCredentials();
    }
}
