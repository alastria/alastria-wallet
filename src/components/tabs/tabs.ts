import { MessageManagerService } from './../../services/messageManager-service';
import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'tabs',
    templateUrl: 'tabs.html'
})
export class Tabs {
    @Input('data') data: any;
    @Input('events') events: any;
    @ViewChild('tabs') tabRef: any;
    
    constructor(private messageManagerService: MessageManagerService,
                public navParams: NavParams) {
        this.checkCredentials(this.navParams.get('credentials'));
    }

    checkCredentials(credentials) {
        if (credentials) {
            this.messageManagerService.prepareDataAndInit(credentials);
            this.navParams.data = null
        }
    }
}
