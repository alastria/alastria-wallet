import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() handleLogin = new EventEmitter<any>();
  accessKeyForm: FormGroup;
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
      key: 'key'
    },
    {
      label: 'Repita clave de acceso',
      key: 'repeatKey'
    }
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private faio: FingerprintAIO,
              private secureStorageService: SessionSecuredStorageService,
              private fb: FormBuilder) {
    this.platform.registerBackButtonAction(() => {
      if (this.loginType) {
        this.loginType = null;
      }
    },1);
  }

  ngOnInit() {
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
      case this.buttons[2].type:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
      default:
        this.title = 'Accede para gestionar tu identidad de Alastria.';
        break;
    }
  }

  async createAccessKey() {
    if (this.accessKeyForm && this.accessKeyForm.status === "VALID") {
      await this.secureStorageService.createAccessKey(this.accessKeyForm.get('key').value);
      this.handleLogin.emit(true);
    }
  }

  /*
  * Generate accessKeyForm with inputsForm
  */
  generateForm(): void {
    const parametersForm: object = {};
    this.inputsKeyForm.map((input: any) => {
        parametersForm[input.key] = [{ value: null}, Validators.required];
    });
    this.accessKeyForm = this.fb.group({
      key: ['', Validators.required],
      repeatKey: ['', Validators.required],
    },
    {
      validator : this.validateAreEqual.bind(this)
    });
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
              next('Ok!');
              this.handleLogin.emit(true);
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
