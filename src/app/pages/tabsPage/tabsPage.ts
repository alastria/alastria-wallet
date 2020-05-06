import { Component } from '@angular/core';

import { SecuredStorageService } from '../../services/securedStorage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'tabsPage',
    templateUrl: 'tabsPage.html'
})
export class TabsPage {

    login: any = {};
    tabs: any = {};
    isLoged: boolean;

    constructor(public router: Router,
                private securedStrg: SecuredStorageService) {

        this.securedStrg.hasKey('loginType').then(
            () => {
                this.isLoged = true;
            }
        ).catch(
            () => {
                this.isLoged = false;
                this.router.navigateByUrl('/homer');
            }
        )

        this.setTabsParams();
    }

    setTabsParams() {
        this.tabs.data = [
            { page: 'Index', icon: 'home', title: 'Inicio' },
            { page: 'Activity', icon: 'act', title: 'Actividad' },
            { page: 'Camera', icon: 'leerQr', title: 'Leer Qr' },
            { page: 'Notification', icon: 'bell', title: 'Avisos' },
            { page: 'Options', icon: 'more', title: 'Mas' }
        ];
    }

}
