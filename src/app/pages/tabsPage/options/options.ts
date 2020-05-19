import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'options.html',
    providers: [ToastService],
    styleUrls: ['/options.scss']
})
export class OptionsPage {
    options = [
        {
            id: 1,
            title: 'Modo oculto',
            selected: true,
            icon: 'leaf',
            button: false
        },
        {
            id: 2,
            title: 'Uso de Wallet Criptomoneda',
            selected: false,
            icon: 'logo-bitcoin',
            button: false
        },
        {
            id: 3,
            title: 'Salir del sistema',
            selected: false,
            icon: 'log-out',
            button: true,
            buttonLabel: 'LogOut',
            callback: () => {
                this.goToRoot();
            }
        }
    ];

    constructor(private router: Router) {
    }

    goToRoot() {
        this.router.navigateByUrl('/login');
    }
}
