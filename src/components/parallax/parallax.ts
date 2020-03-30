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
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        if (changes.data && changes.data.currentValue) {
            this.headerImage = changes.data.currentValue.headerImage;
        }
    }
}
