import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';
import { RegisterHub } from '../register/register-hub/register-hub';
import { Camera } from '../camera/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  login: any = {};
  tabs: any = {};
  isLoged: Boolean;

  constructor(public navCtrl: NavController) {
    console.log("[Debug] HOME enter");
    let user = sessionStorage.getItem("loginName");
    console.log("Username " + user);
    if(!user){
      this.isLoged = false;
      this.setLoginParams();
    }else{
      this.isLoged = true;
      this.navCtrl.push(TabsPage);
    }
  }

  onLogin(params: any) {
    this.isLoged = true;
    sessionStorage.setItem("loginName", params.username);
    this.navCtrl.push(TabsPage);
  }

  onRegister(params: any) {
    this.navCtrl.push(RegisterHub);
  }

  setLoginParams() {
    this.login.data = {
      "forgotPassword": "¿Olvidaste tu contraseña?",
      "labelPassword": "CONTRASEÑA",
      "labelUsername": "USUARIO",
      "login": "Acceder",
      "loginalastria": "Login con AlastriaID",
      "logo": "assets/images/logo/logo.png",
      "password": "Introduce tu contraseña:",
      "register": "¡Regístrate ahora!",
      "skip": "",
      "subtitle": "Bienvenido",
      "title": "Accede a tu cuenta",
      "username": "Introduce tu usuario",
      "dontHaveAccount": "¿No tienes una cuenta?",
      "errorUser": "Dato requerido",
      "errorPassword": "Dato requerido"
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
