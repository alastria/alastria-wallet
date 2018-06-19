import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabsPage/tabsPage';

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
}
