import { Component, OnInit } from '@angular/core';
import { LoginServicesService } from 'src/app/services/login-services.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {

    nombre: string;
    password: string;
    logueado: boolean;

    constructor(private loginService: LoginServicesService) { }

    ngOnInit() {
        this.nombre = '';
        this.password = '';
        this.logueado = false;
    }

    login() {
        if (this.nombre && this.password) {
            var loginOk = this.loginService.login(this.nombre, this.password);
            if (loginOk) {
                // Aqui llamare al servicio que me genera el QR de Cinesa
                this.logueado = true;

            }
            else {

                this.logueado = false;
            }
        }
    }

}
