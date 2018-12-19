import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { RegisterHub } from '../register/register-hub/register-hub';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    login: any = {};
    tabs: any = {};
    isLoged: Boolean;

    constructor(public navCtrl: NavController) {
        let user = sessionStorage.getItem("loginName");
        if (!user) {
            this.isLoged = false;
            this.setLoginParams();
        } else {
            this.isLoged = true;
            this.navCtrl.setRoot(TabsPage);
        }
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
