import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'tabsPage',
  templateUrl: 'tabsPage.html'
})
export class TabsPage {

  @ViewChild('home') nav: NavController

  login: any = {};
  tabs: any = {};
  isLoged: Boolean;

  constructor(public navCtrl: NavController) {
    console.log("[Debug] Tabs enter");
    let user = sessionStorage.getItem("loginName");
    console.log("Username " + user);
    if(!user){
      this.isLoged = false;
      this.navCtrl.setRoot(MyApp);
    }else{
      this.isLoged = true;
    }
    this.setTabsParams();
  }

  setTabsParams() {
    this.tabs.data = [
      { page: "Index", icon: "ios-home", title: "Inicio" },
      { page: "Activity", icon: "ios-albums", title: "Actividad" },
      { page: "Camera", icon: "ios-qr-scanner", title: "Leer Qr" },
      { page: "Notification", icon: "ios-notifications", title: "Avisos" },
      { page: "Options", icon: "ios-more", title: "Mas" }
    ];

    this.tabs.events = {
      'onItemClick': function (item: any) {
        console.log("onItemClick");
      }
    };
  }

}
