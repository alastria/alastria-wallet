import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { SessionSecuredStorageService } from '../../../services/securedStorage.service';

@IonicPage()
@Component({
    selector: 'user-settings',
    templateUrl: 'user-settings.html',
    styleUrls: ['/user-settings.scss']
})
export class UserSettings {

    public userName: string;
    public userImagePath: string;

    constructor(
        public modalCtrl: ModalController,
        private navCtrl: NavController,
        public sessionSecuredStorageService: SessionSecuredStorageService
    ) {
        this.sessionSecuredStorageService.getUsername().then(
            (result) => {
                this.userName = result;
            }
        );
        this.userImagePath = "./assets/images/avatar/0.jpg";
    }

    dismiss() {
        this.navCtrl.pop();
    }
}
