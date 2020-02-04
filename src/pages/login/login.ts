import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private faio: FingerprintAIO,) {
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

  createAccessKey() {
    console.log(this.inputsKeyForm);
  }

  regFinger() {
    return new Promise(
      (next, reject) => {
        this.faio.isAvailable()
          .then(result => {
            console.log('faio ', result);
            this.faio.show({
                clientId: "AlastriaID",
                clientSecret: "NddAHBODmhACXHITWJTU",
                disableBackup: true,
                localizedFallbackTitle: 'Touch ID for AlastriaID', //Only for iOS
            })
            .then(result => {
              console.log('faio ', result);
              next('Ok!');
              // this.isLoged = true;
              this.navCtrl.setRoot(TabsPage);
            })
            .catch(err => {
                console.log('err show ', err);
                // this.isLoged = false;
                reject('Error in fingerprint');
            });
        }).catch(err => {
            console.log('err finger ', err);
            if (err === "cordova_not_available") {
              reject('Cordova not aviable');
            }
        });
      }
    )
  }

}
