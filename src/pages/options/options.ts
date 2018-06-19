import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  templateUrl: 'options.html',
  providers: [TabsService, ToastService]
})
export class Options {

  data: any = {};
  animateItems: any = {};

  constructor(public navCtrl: NavController, public app: App) {
    this.data = {
      title: "Más"
    }
    this.animateItems = [
      {
        id: 1,
        title: "Test 1",
        selected: true,
        icon: "leaf",
        button: false
      },
      {
        id: 2,
        title: "Test 2",
        selected: false,
        icon: "logo-bitcoin",
        button: false
      },
      {
        id: 2,
        title: "LogOut",
        selected: false,
        icon: "log-out",
        button: true,
        buttonLabel: "LogOut",
        callback: () => {
          sessionStorage.removeItem("loginName");
          this.goToRoot();
        }
      }
    ]

  }

  goToRoot() {
    //this.navCtrl.setRoot(HomePage);
    this.app.getRootNav().setRoot(HomePage);
  }
}
