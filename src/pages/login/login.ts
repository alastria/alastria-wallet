import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

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
  title: string = 'Accede para gestionar tu identidad de Alastria.';
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
  ];
  inputsKeyForm: Array<any> = [
    {
      label: 'Clave de acceso',
      value: ''
    },
    {
      label: 'Repita clave de acceso',
      value: ''
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private platform: Platform) {
    this.platform.registerBackButtonAction(() => {
      if (this.loginType) {
        this.loginType = null;
      }
    },1);
  }

  selectTypeLogin(type: string) {
    this.loginType = type;
    switch (this.loginType) {
      case this.buttons[0].type:
        this.title = 'Crea un código con el que poder accede a tu AlastriaID';
        break;
      case this.buttons[1].type:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
      case this.buttons[2].type:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
      default:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
    }
  }

}
