import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../../home/home';

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
            "toolbarTitle": "Registro",
            "logo": "assets/images/logo/logo.png",
            "register": "registro",
            "title": "Registre su nueva cuenta",
            "username": "Elija un nombre de usuario",
            "city": "Your home town",
            "country": "¿De dónde eres?",
            "password": "Introduzca una contraseña",
            "email": "Introduzca un correo electrónico",
            "back": "Volver",
            "lableUsername": "CUENTA",
            "lablePassword": "CONTRASEÑA",
            "lableEmail": "E-MAIL",
            "lableCountry": "PAIS",
            "lableCity": "CIUDAD",
            "errorUser": "Este campo no puede estar vacío.",
            "errorPassword": "Este campo no puede estar vacío.",
            "errorEmail": "Formato incorrecto.",
            "errorCountry": "Este campo no puede estar vacío.",
            "errorCity": "Este campo no puede estar vacío."
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

        if (!this.country || this.country.length == 0) {
            this.isCountryValid = false;
        }

        this.isEmailValid = this.regex.test(this.email);

        return this.isEmailValid &&
            this.isPasswordValid &&
            this.isUsernameValid &&
            this.isCountryValid;
    }
}
