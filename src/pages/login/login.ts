import { IdentitySecuredStorageService } from './../../services/securedStorage.service';
import { Component, OnInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


// SERVICES
import { SessionSecuredStorageService } from '../../services/securedStorage.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

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
  @Output() handleLogin = new EventEmitter<boolean>();
  accessKeyForm: FormGroup;
  title: string = 'Accede para gestionar tu identidad de Alastria.';
  logoUrl: string = 'assets/images/logo/logo.png';
  loginType: string; // key = key access; patron = patron access; fingerprint
  buttons: Array<any> = [
    {
      type: 'key',
      label: 'CREA CLAVE DE ACCESO '
    }
  ];
  inputsKeyForm: Array<any> = [
    {
      label: 'Clave de acceso',
      key: 'key'
    },
    {
      label: 'Repita clave de acceso',
      key: 'repeatKey'
    }
  ];
  hashKey: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private faio: FingerprintAIO,
              private secureStorageService: SessionSecuredStorageService,
              private identtityStorageService: IdentitySecuredStorageService,
              private fb: FormBuilder) {
    this.platform.registerBackButtonAction(async () => {
      if (this.loginType) {
        if (!this.hashKey) {
          this.loginType = null;
        }
      }
    },1);
    this.platform.ready()
      .then(async () => {
        await this.identtityStorageService.initSecureStorage();
        await this.secureStorageService.initSecureStorage();
        this.hashKey = await this.secureStorageService.hasKey('loginType');

        if (this.hashKey) {
          const loginTypeRes = await this.secureStorageService.getLoginType();
          this.selectTypeLogin(loginTypeRes);
        } else {
          this.faio.isAvailable()
            .then( () => {
              this.buttons.push(
                {
                  type: 'fingerprint',
                  label: 'ACCEDE CON HUELLA'
                }
              )
            })
            .catch( () => {
              this.selectTypeLogin(this.buttons[0].type);
            })
        }
      });
  }

  selectTypeLogin(type: string) {
    this.loginType = type;
    switch (this.loginType) {
      case this.buttons[0].type:
        this.generateForm();
        this.title = 'Crea un código con el que poder accede a tu AlastriaID';
        break;
      case this.buttons[1].type:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
      default:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
    }
  }

  async createAccessKey() {
    if (this.accessKeyForm && this.accessKeyForm.status === "VALID") {
      await this.secureStorageService.setLoginType(this.loginType);
      const hasKey = await this.secureStorageService.hasKey('accessKey');
      if (!hasKey) {
        await this.secureStorageService.setAccessKey(this.accessKeyForm.get('key').value);
      }
      const isAuthorized = await this.secureStorageService.isAuthorized(this.accessKeyForm.get('key').value);
      if (!isAuthorized) {
        this.accessKeyForm.get('key').setErrors({incorrect: true});
      }
      this.handleLogin.emit(isAuthorized);
    }
  }

  /*
  * Generate accessKeyForm with inputsForm
  */
  generateForm(): void {
    if (this.hashKey) {
      this.inputsKeyForm.splice(1,1);
      this.accessKeyForm = this.fb.group({
        key: [null, Validators.required]
      });
    } else {
      this.accessKeyForm = this.fb.group({
        key: [null, Validators.required],
        repeatKey: [null, Validators.required],
      },
      {
        validator : this.validateAreEqual.bind(this)
      });
    }
  }

   /*
  * Check if passwords are equal
  */
  private validateAreEqual(): void {
    if (this.accessKeyForm &&  this.accessKeyForm.get('repeatKey') && this.accessKeyForm.get('key')) {
    }
    if (this.accessKeyForm &&  this.accessKeyForm.get('repeatKey') && this.accessKeyForm.get('key')
      && this.accessKeyForm.get('repeatKey').value !== '' && this.accessKeyForm.get('key').value !== ''
      && this.accessKeyForm.get('repeatKey').value !== this.accessKeyForm.get('key').value) {
        this.accessKeyForm.get('repeatKey').setErrors({mismatch: true});
    } else {
      if (this.accessKeyForm && this.accessKeyForm.get('repeatKey') && this.accessKeyForm.get('repeatKey').value !== '') {
        this.accessKeyForm.get('repeatKey').setErrors(null);
      }
    }
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
              this.secureStorageService.setLoginType(this.loginType)
                .then(result => {
                  this.handleLogin.emit(true);
                });
            })
            .catch(err => {
                console.log('err show ', err);              
                this.handleLogin.emit(false);
                reject('Error in fingerprint');
            });
        }).catch(err => {
            console.log('err finger ', err);
            this.handleLogin.emit(false);
            if (err === "cordova_not_available") {
              reject('Cordova not aviable');
            }
        });
      }
    )
  }

}
