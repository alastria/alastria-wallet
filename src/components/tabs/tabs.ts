import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'tabs',
    templateUrl: 'tabs.html'
})
export class Tabs {
    @Input('data') data: any;
    @Input('events') events: any;
    @ViewChild('tabs') tabRef: any;
    
    constructor() {
     }
}
