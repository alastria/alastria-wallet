import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
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
        private faio: FingerprintAIO
    ) { }

    async ngOnInit(): Promise<void> {
        // Is session registered
        this.setLoginParams();
        this.sessionSecuredStorageService.isRegistered().then(
            () => {
                this.isRegistered = true;
                this.regFinger().then(
                    () => {
                        this.isLoged = true;
                        this.navCtrl.setRoot(TabsPage);
                    }
                ).catch(
                    () => {
                        this.isLoged = false;
                    }
                )
            },
            err => {
                console.error(err);
            }
        )

        // Test
        // this.alastriaPublicKeyRegistry.getAccountInfo().then(
        //     async (succ: any) => {
        //         console.log('Test ok!', succ);
        //         // const publicKeyInit = 'Hola currito, soy una clave publica!';
        //         const publicKeyInit = keypair();
        //         console.log(publicKeyInit);

        //         let status = await this.alastriaPublicKeyRegistry.registryStatus(succ.fromAccount);
        //         const publicKey = this.alastriaPublicKeyRegistry.toUtf8(status)
        //         console.log('Status: ', publicKey);

        //         if (!this.alastriaPublicKeyRegistry.isStatusDefined(status)) {
        //             let result = await this.alastriaPublicKeyRegistry.registrySet(publicKeyInit.public, succ.fromAccount);
        //             console.log('Status: ', result);
        //         } else {
        //             let statusObj = await this.alastriaPublicKeyRegistry.registryStatusObject(succ.fromAccount, publicKey);
        //             console.log('Status obj: ', statusObj);
        //         }

        //     },
        //     err => {
        //         console.error('Test error!', err);
        //     }
        // );
    }

    onLogin(params: any) {
        this.isLoged = true;
        sessionStorage.setItem("loginName", params.username);
        this.navCtrl.setRoot(TabsPage);
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
                    }).catch(err => {
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
