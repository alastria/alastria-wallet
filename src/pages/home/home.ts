import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
    console.log("Username " + user);
    if(!user){
      this.isLoged = false;
      this.setLoginParams();
    }else{
      this.isLoged = true;
    }
    this.setTabsParams();
  }

  onLogin(params: any) {
    this.isLoged = true;
    sessionStorage.setItem("loginName", params.username);
  }

  setLoginParams() {
    this.login.data = {
      "forgotPassword": "Forgot password?",
      "labelPassword": "PASSWORD",
      "labelUsername": "USERNAME",
      "login": "Login",
      "logo": "assets/images/logo/logo.png",
      "password": "Enter your password",
      "register": "Register now!",
      "skip": "",
      "subtitle": "Welcome",
      "title": "Login to your account",
      "username": "Enter your username"
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

  setTabsParams() {
    this.tabs.data = [
      { page: "Index", icon: "ios-home", title: "Inicio" },
      { page: "Activity", icon: "ios-albums", title: "Actividad" },
      { page: "Index", icon: "ios-qr-scanner", title: "Leer Qr" },
      { page: "Index", icon: "ios-notifications", title: "Avisos" },
      { page: "Index", icon: "ios-more", title: "Mas" }
    ];

    this.tabs.events = {
      'onItemClick': function (item: any) {
        console.log("onItemClick");
      }
    };
  }

}
