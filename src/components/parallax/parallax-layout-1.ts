import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content } from 'ionic-angular';
import { UserInfoHeader } from '../user-info-header/user-info-header';

@IonicPage()
@Component({
    selector: 'parallax-layout-1',
    templateUrl: 'parallax.html'
})
export class ParallaxLayout1 {
    @Input() data: any;
    @Input() events: any;

    active: boolean;
    headerImage: any = "";

    constructor() { }

    onEvent(event: string, item: any, e: any) {
        if (e) {
            e.stopPropagation();
        }
        if (this.events[event]) {
            this.events[event](item);
        }
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        if (changes.data && changes.data.currentValue) {
            this.headerImage = changes.data.currentValue.headerImage;
        }
    }

    isClassActive() {
        return this.active;
    }
}
