import { Component } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { ToastService } from '../../../services/toast-service';
import { MyApp } from '../../../app/app.component';
import { getNav } from '../../../utils';

@IonicPage()
@Component({
    templateUrl: 'options.html',
    providers: [ToastService]
})
export class Options {

    data: any = {
        title: "Más"
    };
    options = [
        {
            id: 1,
            title: "Modo oculto",
            selected: true,
            icon: "leaf",
            button: false
        },
        {
            id: 2,
            title: "Uso de Wallet Criptomoneda",
            selected: false,
            icon: "logo-bitcoin",
            button: false
        },
        {
            id: 3,
            title: "Salir del sistema",
            selected: false,
            icon: "log-out",
            button: true,
            buttonLabel: "LogOut",
            callback: () => {
                this.goToRoot();
            }
        }
    ];

    constructor(private app: App) {
    }

    goToRoot() {
        const nav = getNav(this.app);
        nav.setRoot(MyApp);
    }
}
