import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

// Services
import { SecuredStorageService } from '../../../services/securedStorage.service';

@Component({
    selector: 'user-settings',
    templateUrl: 'user-settings.html',
    styleUrls: ['/user-settings.scss']
})
export class UserSettingsPage {

    public userName: string;
    public userImagePath: string;

    constructor(
        public modalCtrl: ModalController,
        private navController: NavController,
        public securedStrg: SecuredStorageService
    ) {
        this.securedStrg.getUsername().then(
            (result) => {
                this.userName = result;
            }
        );
        this.userImagePath = './assets/images/avatar/0.jpg';
    }

}
