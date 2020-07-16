import { AuthenticationService } from './../../services/authentication.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';


// SERVICES
import { SecuredStorageService } from '../../services/securedStorage.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { parseCredentials } from 'src/utils';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'login-page',
  // tslint:disable-next-line: no-host-metadata-property
  host: {class: 'btnLogin'},
  templateUrl: 'login.html',
  styleUrls: ['/login.scss']
})
export class LoginPage {
  isLogged = false;
  token: string;
  credentials: string;
  accessKeyForm: FormGroup;
  title = 'Accede para gestionar tu identidad de Alastria.';
  logoUrl = 'assets/images/logo/letter-alastria-white.png';
  loginType: string; // key = key access; fingerprint
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
  hashKeyLoginType: boolean;

  constructor(private platform: Platform,
              private faio: FingerprintAIO,
              private securedStrg: SecuredStorageService,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private deeplinks: Deeplinks) {
    this.platform.backButton.subscribe(() => {
      if (this.loginType) {
        if (!this.hashKeyLoginType) {
          this.loginType = null;
        }
      }
    });

    this.platform.ready()
      .then(async () => {
        await this.securedStrg.initSecureStorage();
        await this.securedStrg.set('isLogged', 'false');
        this.hashKeyLoginType = await this.securedStrg.hasKey('loginType');

        if (this.hashKeyLoginType) {
          const loginTypeRes = await this.securedStrg.getLoginType();
          this.selectTypeLogin(loginTypeRes);
        } else {
          this.faio.isAvailable()
            .then( (res) => {
              if (res === 'OK') {
                this.buttons.push(
                  {
                    type: 'fingerprint',
                    label: 'ACCEDE CON HUELLA'
                  }
                );
              } else {
                this.selectTypeLogin(this.buttons[0].type);
              }
            })
            .catch(() => {
              this.selectTypeLogin(this.buttons[0].type);
            });
        }
        this.deeplinks.route({
            '/': LoginPage,
            '/login': LoginPage,
            '/createAI': LoginPage,
            '/createCredentials': LoginPage,
            '/createPresentations': LoginPage
        }).subscribe(
            async (match) => {
                const path = (match &&  match.$link) ? match.$link.path : null;
                const isLogged = await this.securedStrg.get('isLogged');
                this.isLogged = (isLogged) ? JSON.parse(isLogged) : false;
                this.controlDeeplink(path, match.$args);
            },
            (noMatch) => {
            }
        );
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
    if (this.accessKeyForm && this.accessKeyForm.status === 'VALID') {
      await this.securedStrg.setLoginType(this.loginType);
      const hasKey = await this.securedStrg.hasKey('accessKey');
      if (!hasKey) {
        await this.securedStrg.setAccessKey(this.accessKeyForm.get('key').value.toString());
      }
      const isAuthorized = await this.authenticationService.login(this.accessKeyForm.get('key').value);
      if (!isAuthorized) {
        this.accessKeyForm.get('key').setErrors({incorrect: true});
      }
      this.handleLogin(isAuthorized);
    }
  }

  /*
  * Generate accessKeyForm with inputsForm
  */
  generateForm(): void {
    if (this.hashKeyLoginType) {
      this.inputsKeyForm.splice(1, 1);
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
            this.faio.show({
                //clientId: 'AlastriaID',
                //clientSecret: 'NddAHBODmhACXHITWJTU',
                disableBackup: true,
                //localizedFallbackTitle: 'Touch ID for AlastriaID', // Only for iOS
            })
            .then(() => {
              this.securedStrg.setLoginType(this.loginType)
                .then(() => {
                  this.handleLogin(true);
                });
            })
            .catch(() => {
                this.handleLogin(false);
                reject('Error in fingerprint');
            });
        }).catch(err => {
            this.handleLogin(false);
            if (err === 'cordova_not_available') {
              reject('Cordova not aviable');
            } else {
              reject(err);
            }
        });
      }
    );
  }

  async handleLogin(isLogged: boolean): Promise<any> {
    this.isLogged = isLogged;
    await this.securedStrg.set('isLogged', this.isLogged.toString());
    if (isLogged) {
        const did = await this.securedStrg.hasKey('userDID');
        if (did) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
                token: this.token
            }
          };

          this.router.navigate(['/', 'tabs', 'index'], navigationExtras);
        } else {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                  token: this.token
              }
            };
            this.router.navigate(['/', 'entities'], navigationExtras);
        }
    }
  }

  private controlDeeplink(path: string, args: any) {
    switch (path) {
        case '/createAI':
            this.securedStrg.hasKey('userDID')
                .then((DID) => {
                  this.token = args.alastriaToken;
                });
            break;
        case '/createCredentials':
            this.token = parseCredentials(args.credentials);

            if (!this.isLogged) {
                this.handleLogin(this.isLogged);
            }
            break;

        case '/login':
        case '/createPresentations':
            this.token = args.alastriaToken;

            if (!this.isLogged) {
                this.handleLogin(this.isLogged);
            }
            break;

        default:

            break;
    }
  }


}
