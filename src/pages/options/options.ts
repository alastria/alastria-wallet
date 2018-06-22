import { Component } from '@angular/core';
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
        title: "Modo oculto",
        selected: true,
        icon: "leaf",
        button: false
      },
      {
        id: 2,
        title: "Uso de Wallet Criptomoneda",
        selected: false,
        icon: "logo-bitcoin",
        button: false
      },
      {
        id: 2,
        title: "Salir del sistema",
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
