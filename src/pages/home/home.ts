import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { SessionSecuredStorageService } from '../../services/securedStorage.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    login: any = {};
    tabs: any = {};
    isLoged: Boolean;
    isRegistered: Boolean;

    constructor(
        public navCtrl: NavController,
        private sessionSecuredStorageService: SessionSecuredStorageService,
        private faio: FingerprintAIO,
        public alertCtrl: AlertController
    ) { }

    async ngOnInit(): Promise<void> {
        // Is session registered
        this.setLoginParams();
        return this.sessionSecuredStorageService.isRegistered().then(
            (result) => {
                this.isRegistered = true;
                this.login.data.isRegistered = true;
                this.login.data.userRegister = result;
            }
        ).catch(
            (error) => {
                console.error('No esta registrado', error);
            }
        )

        // Test
        /* this.alastriaPublicKeyRegistry.getAccountInfo().then(
            async (succ: any) => {
                console.log('Test ok!', succ);
                // const publicKeyInit = 'Hola currito, soy una clave publica!';
                const publicKeyInit = keypair();
                console.log(publicKeyInit);

                let status = await this.alastriaPublicKeyRegistry.registryStatus(succ.fromAccount);
                const publicKey = this.alastriaPublicKeyRegistry.toUtf8(status)
                console.log('Status: ', publicKey);

                if (!this.alastriaPublicKeyRegistry.isStatusDefined(status)) {
                    let result = await this.alastriaPublicKeyRegistry.registrySet(publicKeyInit.public, succ.fromAccount);
                    console.log('Status: ', result);
                } else {
                    let statusObj = await this.alastriaPublicKeyRegistry.registryStatusObject(succ.fromAccount, publicKey);
                    console.log('Status obj: ', statusObj);
                }

            },
            err => {
                console.error('Test error!', err);
            }
        ); */
    }

    showAlert(title: string, message: string) {
        const alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    onLogin(params: any) {
        if (this.isRegistered) {
            this.sessionSecuredStorageService.getUsername().then(
                (result) => {
                    params.username = result;
                    this.sessionSecuredStorageService.checkPassword(params.username, params.password).then(
                        (res) => {
                            if (res) {
                                this.isLoged = true;
                                this.navCtrl.setRoot(TabsPage);
                            }
                            else {
                                this.showAlert('Credenciales erroneas', 'Las credenciales introducidas no son correctas');
                            }
                        }
                    ).catch(
                        (err) => {
                            this.showAlert('Error al comprobar credenciales', 'Ha habido un error al comprobar las credenciales');
                        }
                    );
                }
            ).catch(
                (error) => {
                    this.showAlert('Usuario no registrado', 'Tienes que crear previamente una cuenta, para poder logarte en la aplicación');
                }
            );
        }
        // no esta registrado
        else {
            this.showAlert('Usuario no registrado', 'Tienes que crear previamente una cuenta, para poder logarte en la aplicación');
        }
    }

    onRegister(params: any) {
        this.navCtrl.setRoot(WalkthroughPage);
    }

    setLoginParams() {
        this.login.data = {
            "forgotPassword": "¿No recuerda la contraseña?",
            "labelPassword": "Contraseña",
            "labelUsername": "AlastriaID",
            "login": "Acceder",
            "loginalastria": "INICIAR SESIÓN",
            "logo": "assets/images/logo/logo2.png",
            "password": "Introduce tu contraseña:",
            "register": "¡Regístrate ahora!",
            "skip": "",
            "subtitle": "Bienvenido",
            "title": "Accede a tu cuenta",
            "username": "Introduce tu usuario",
            "dontHaveAccount": "¿Aun no tienes cuenta?",
            "newAccount": "Créala aquí",
            "errorUser": "Dato requerido",
            "errorPassword": "Dato requerido",
            "loginFinger": "Accede con tu huella",
            "help": "Ayuda"
        }

        let that = this;
        this.login.events = {
            onLogin: function (params) {
                that.onLogin(params);

            },
            onForgot: function () {

            },
            onRegister: function (params) {
                that.onRegister(params);
            },
            onSkip: function (params) {

            },
            onFacebook: function (params) {

            },

            regFinger: function (params) {
                that.regFinger();
            }
        };
    }

    regFinger() {
        return new Promise(
            (next, reject) => {
                this.faio.isAvailable().then(result => {
                    this.faio.show({
                        clientId: "AlastriaID",
                        clientSecret: "NddAHBODmhACXHITWJTU",
                        disableBackup: true,
                        localizedFallbackTitle: 'Touch ID for AlastriaID', //Only for iOS
                    }).then(result => {
                        next('Ok!');
                        this.isLoged = true;
                        this.navCtrl.setRoot(TabsPage);
                    }).catch(err => {
                        this.isLoged = false;
                        reject('Error in fingerprint');
                    });
                }).catch(err => {
                    if (err === "cordova_not_available") {
                        reject('Cordova not aviable');
                    }
                });
            }
        )

    }
}
