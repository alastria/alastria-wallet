import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private app: App) {
    console.log("[Debug] HOME enter");
    let user = sessionStorage.getItem("loginName");
    console.log("Username " + user);
    if(!user){
      this.isLoged = false;
      this.setLoginParams();
    }else{
      this.isLoged = true;
      this.app.getRootNav().setRoot(TabsPage);
    }
  }

  onLogin(params: any) {
    this.isLoged = true;
    sessionStorage.setItem("loginName", params.username);
    this.app.getRootNav().setRoot(TabsPage);
  }

  onRegister(params: any) {
    this.app.getRootNav().setRoot(RegisterHub);
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
        console.log('onLogin: ' + this.isLoged);
      },
      onForgot: function () {
        console.log('onForgot:');
      },
      onRegister: function (params) {
        that.onRegister(params);
        console.log('onRegister:');
      },
      onSkip: function (params) {
        console.log('onSkip:');
      },
      onFacebook: function (params) {
        console.log('onFacebook:');
      }
    };
  }
}
