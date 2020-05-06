import { Component, Input, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { parseCredentials } from '../../../utils';

// SERVICES
import { MessageManagerService } from '../../services/messageManager-service';

// PAGES - COMPONENTS
import { TabsPage } from '../../pages/tabsPage/tabsPage';

@Component({
    selector: 'tabs',
    templateUrl: 'tabs.html',
    styleUrls: ['./tabs.scss']
})
export class TabsComponent {
    @Input() data: any;
    @Input() events: any;
    @ViewChild('tabs', {read: '', static: false}) tabRef: any;

    constructor(private messageManagerService: MessageManagerService,
                public navParams: NavParams,
                private deeplinks: Deeplinks) {
        this.checkTokenAndPrepare(this.navParams.get('token'));
        this.deeplinks.route({
            '/': TabsPage,
            '/login': TabsPage,
            '/createCredentials': TabsPage,
            '/createPresentations': TabsPage
        }).subscribe(
            (match: any) => {
                const path = (match &&  match.$link) ? match.$link.path : null;
                this.controlDeeplink(path, match.$args);
            },
            (noMatch: any) => {
                console.log('No Match ', noMatch);
            }
        );
    }

    checkTokenAndPrepare(token: any) {
        if (token) {
            this.messageManagerService.prepareDataAndInit(token, true);
            this.navParams.data.token = null;
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
