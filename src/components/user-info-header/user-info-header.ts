import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

// Components
import { UserSettings } from './userSettings/user-settings';
import { ProfilePage } from '../../pages/profile/profile';

// Services
import { SecuredStorageService } from '../../services/securedStorage.service';

@IonicPage()
@Component({
    selector: 'user-info-header',
    templateUrl: 'user-info-header.html',
    styleUrls: ['/user-info-header.scss']
})
export class UserInfoHeader {

    public userName: string;
    public userImagePath: string;

    @Input() compact: boolean; //  If is true then rectangle
    @Input() fixed: boolean;

    constructor(public navController: NavController,
        public securedStrg: SecuredStorageService) {
        this.securedStrg.getUsername().then(
            (result) => {
                this.userName = result;
            }
        );
        this.userImagePath = "./assets/images/avatar/0.jpg";
    }

    public openUserSettings(): void {
        this.navController.push(UserSettings);
    }

    profilePage() {
        let p = this.navController.getActive();
        if (p.component.name !== 'ProfilePage') {
            this.navController.push(ProfilePage);
        }
    }

}
