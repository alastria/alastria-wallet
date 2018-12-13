import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { HomePage } from '../home/home';

@IonicPage()
@Component({
    selector: 'tabsPage',
    templateUrl: 'tabsPage.html'
})
export class TabsPage {

    login: any = {};
    tabs: any = {};
    isLoged: Boolean;

    constructor(public navCtrl: NavController) {
        let user = sessionStorage.getItem("loginName");
        if (!user) {
            this.isLoged = false;
            this.navCtrl.setRoot(HomePage);
        } else {
            this.isLoged = true;
        }
        this.setTabsParams();
    }

    setTabsParams() {
        this.tabs.data = [
            { page: "Index", icon: "ios-home-outline", title: "Inicio" },
            { page: "Activity", icon: "ios-albums-outline", title: "Actividad" },
            { page: "Camera", icon: "ios-qr-scanner-outline", title: "Leer Qr" },
            { page: "Notification", icon: "ios-notifications-outline", title: "Avisos" },
            { page: "Options", icon: "ios-more-outline", title: "Mas" }
        ];

        this.tabs.events = {
            'onItemClick': function (item: any) {

            }
        };
    }

}
