import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { SecuredStorageService } from '../../services/securedStorage.service';

@Component({
    selector: 'user-info-header',
    templateUrl: 'user-info-header.html',
    styleUrls: ['user-info-header.scss']
})
export class UserInfoHeaderComponent {

    public userName: string;
    public userImagePath: string;

    @Input() compact: boolean; //  If is true then rectangle
    @Input() fixed: boolean;

    constructor(public router: Router,
                public securedStrg: SecuredStorageService) {
        this.securedStrg.getUsername().then(
            (result) => {
                this.userName = result;
            }
        );
        this.userImagePath = './assets/images/avatar/0.jpg';
    }

    public openUserSettings(): void {
        this.router.navigate(['/', 'settings']);
    }

    profilePage() {
        // let p = this.navController.getActive();
        // if (p.component.name !== 'ProfilePage') {
            this.router.navigate(['/', 'profile']);
        // }
    }

}
