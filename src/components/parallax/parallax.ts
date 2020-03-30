import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'parallax',
    templateUrl: 'parallax.html'
})
export class Parallax {
    @Input() data: any;
    @Input() events: any;

    active: boolean;
    headerImage: any = "";

    constructor() {
        console.log('-------- Paralax -------');
    }

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
