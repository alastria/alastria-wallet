import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../../home/home';

@IonicPage()
@Component({
    selector: 'register-form',
    templateUrl: 'register-form.html'
})
export class RegisterForm {
    @Input() data: any;
    @Input() events: any;

    public username: string;
    public password: string;
    public country: string;
    public city: string;
    public email: string;

    private isEmailValid: boolean = true;
    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;
    private isCityValid: boolean = true;
    private isCountryValid: boolean = true;

    private regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(private navCtrl: NavController) {
        this.data = {
            "toolbarTitle": "Register",
            "logo": "assets/images/logo/logo.png",
            "register": "register",
            "title": "Register your new account",
            "username": "Enter your username",
            "city": "Your home town",
            "country": "Where are you from?",
            "password": "Enter your password",
            "email": "Your e-mail address",
            "back": "Volver",
            "lableUsername": "USERNAME",
            "lablePassword": "PASSWORD",
            "lableEmail": "E-MAIL",
            "lableCountry": "COUNTRY",
            "lableCity": "CITY",
            "errorUser": "Field can't be empty.",
            "errorPassword": "Field can't be empty.",
            "errorEmail": "Invalid email address.",
            "errorCountry": "Field can't be empty.",
            "errorCity": "Field can't be empty."
        };

        this.events = {
            onRegister: () => {
                this.navCtrl.setRoot(HomePage);
            },
            onSkip: () => {
                this.navCtrl.setRoot(HomePage);
            },
            onBack: () => {
                this.navCtrl.setRoot(HomePage);
            }
        }
    }

    onEvent = (event: string): void => {
        if (event == "onRegister" && !this.validate()) {
            return;
        }
        if (this.events[event]) {
            this.events[event]({
                'username': this.username,
                'password': this.password,
                'country': this.country,
                'city': this.city,
                'email': this.email
            });
        }
    }

    validate(): boolean {
        this.isEmailValid = true;
        this.isUsernameValid = true;
        this.isPasswordValid = true;
        this.isCityValid = true;
        this.isCountryValid = true;

        if (!this.username || this.username.length == 0) {
            this.isUsernameValid = false;
        }

        if (!this.password || this.password.length == 0) {
            this.isPasswordValid = false;
        }

        if (!this.password || this.password.length == 0) {
            this.isPasswordValid = false;
        }

        if (!this.city || this.city.length == 0) {
            this.isCityValid = false;
        }

        if (!this.country || this.country.length == 0) {
            this.isCountryValid = false;
        }

        this.isEmailValid = this.regex.test(this.email);

        return this.isEmailValid &&
            this.isPasswordValid &&
            this.isUsernameValid &&
            this.isCityValid &&
            this.isCountryValid;
    }
}
