import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'parallax',
    templateUrl: 'parallax.html',
    styleUrls: ['/parallax.scss']
})
export class ParallaxPage implements OnChanges {
    @Input() data: any;
    @Input() events: any;

    active: boolean;
    headerImage: any = '';

    constructor() {
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        if (changes.data && changes.data.currentValue) {
            this.headerImage = changes.data.currentValue.headerImage;
        }
    }
}
