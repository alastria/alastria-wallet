import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { RegisterHub } from '../register/register-hub/register-hub';
import { AlastriaPublicKeyRegistryService } from '../../services/alastriaPublicKeyRegistry.service';

import * as keypair from 'keypair';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    login: any = {};
    tabs: any = {};
    isLoged: Boolean;

    constructor(
        public navCtrl: NavController,
        private alastriaPublicKeyRegistry: AlastriaPublicKeyRegistryService
    ) {
        let user = sessionStorage.getItem("loginName");
        if (!user) {
            this.isLoged = false;
            this.setLoginParams();
        } else {
            this.isLoged = true;
            this.navCtrl.setRoot(TabsPage);
        }

        // Test
        this.alastriaPublicKeyRegistry.getAccountInfo().then(
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
        );
    }

    onLogin(params: any) {
        this.isLoged = true;
        sessionStorage.setItem("loginName", params.username);
        this.navCtrl.setRoot(TabsPage);
    }

    onRegister(params: any) {
        this.navCtrl.setRoot(RegisterHub);
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
}
