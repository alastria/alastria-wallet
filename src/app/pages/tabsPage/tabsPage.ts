import { Component } from '@angular/core';

import { SecuredStorageService } from '../../services/securedStorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageManagerService } from 'src/app/services/messageManager-service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { parseCredentials } from 'src/utils';

@Component({
    selector: 'tabsPage',
    templateUrl: 'tabsPage.html',
    styleUrls: ['/tabsPage.scss']
})
export class TabsPage {

    login: any = {};
    constructor(
        private messageManagerService: MessageManagerService,
        private deeplinks: Deeplinks,
        private router: Router,
        private securedStrg: SecuredStorageService,
    ) {
            this.deeplinks.route({
                '/': TabsPage,
                '/login': TabsPage,
                '/createCredentials': TabsPage,
                '/createPresentations': TabsPage
            }).subscribe(
                async (match: any) => {
                    const path = (match &&  match.$link) ? match.$link.path : null;
                    let isLogged = await this.securedStrg.get('isLogged');
                    isLogged = (isLogged) ? JSON.parse(isLogged) : false;

                    if (isLogged) {
                        this.controlDeeplink(path, match.$args);
                    }
                },
                (noMatch: any) => {
                }
            );
    }

    checkTokenAndPrepare(token: any) {
        if (token) {
            this.messageManagerService.prepareDataAndInit(token, true);
        }
    }

    private controlDeeplink(path: string, args: any) {
        switch (path) {
            case '/createCredentials':
                const credentials = parseCredentials(args.credentials);

                this.checkTokenAndPrepare(credentials);

                break;

            case '/login':
            case '/createPresentations':
                this.checkTokenAndPrepare(args.alastriaToken);

                break;

            default:

                break;
        }
    }
}
