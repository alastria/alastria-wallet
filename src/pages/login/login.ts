import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
})
export class LoginPage {
  logoUrl: string = 'assets/images/logo/logo.png';
  loginType: string; // key = key access; patron = patron access; fingerprint
  buttons: Array<any> = [
    {
      type: 'key',
      label: 'CREA CLAVE DE ACCESO '
    },
    {
      type: 'patron',
      label: 'ACCEDE CON PATRON'
    },
    {
      type: 'fingerprint',
      label: 'ACCEDE CON HUELLA'
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('button ', this.buttons);
  }

  selectTypeLogin(type: string) {
    console.log(type);
  }

}
