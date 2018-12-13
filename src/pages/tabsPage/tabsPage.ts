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
            { page: "Index", icon: "home", title: "Inicio" },
            { page: "Activity", icon: "act", title: "Actividad" },
            { page: "Camera", icon: "leerQr", title: "Leer Qr" },
            { page: "Notification", icon: "bell", title: "Avisos" },
            { page: "Options", icon: "more", title: "Mas" }
        ];

        this.tabs.events = {
            'onItemClick': function (item: any) {

            }
        };
    }

}
