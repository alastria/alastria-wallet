import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { ProfilePage } from '../../../pages/profile/profile';

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
        private navCtrl: NavController
    ) {
        let user = sessionStorage.getItem("loginName");
        this.userName = user;
        this.userImagePath = "./assets/images/avatar/0.jpg";
    }

    dismiss() {
        this.navCtrl.pop();
    }

    profilePage() {
        this.navCtrl.push(ProfilePage);
    }
}
