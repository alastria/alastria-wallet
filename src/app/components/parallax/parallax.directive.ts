import { Directive, ElementRef, Input, Renderer2, SimpleChanges, AfterViewInit, OnChanges } from '@angular/core';


@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[scrollHide]'
})
export class ScrollHideDirective implements AfterViewInit, OnChanges {
    @Input() config: ScrollHideConfig;
    @Input() scrollContent: any;

    contentHeight: number;
    scrollHeight: number;
    lastScrollPosition: number;
    lastValue = 0;
    lastValueButton = 105;

    button: HTMLElement;

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    ngAfterViewInit() {
        this.button = document.getElementsByClassName('ion-md-leerQr')[0] as HTMLElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.scrollContent && this.config) {
            this.scrollContent.ionScrollStart.subscribe((ev) => {
                this.contentHeight = this.scrollContent.getScrollElement().offsetHeight;
                this.scrollHeight = this.scrollContent.getScrollElement().scrollHeight;
                if (this.config.maxValue === undefined) {
                    this.config.maxValue = this.element.nativeElement.offsetHeight;
                }
                this.lastScrollPosition = ev.scrollTop;
            });
            this.scrollContent.ionScroll.subscribe((ev) => this.adjustElementOnScroll(ev));
            this.scrollContent.ionScrollEnd.subscribe((ev) => this.adjustElementOnScroll(ev));
        }
    }

    private adjustElementOnScroll(ev: any) {
        if (ev) {
            ev.domWrite(() => {
                const scrollTop = ev.scrollTop > 0 ? ev.scrollTop : 0;
                const scrolldiff = (scrollTop - this.lastScrollPosition) / 1.75;
                this.lastScrollPosition = scrollTop;

                let newValue = this.lastValue + scrolldiff;
                let newValueButton = this.lastValueButton - scrolldiff;
                newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
                newValueButton = Math.max(64, Math.min(newValueButton, 105));

                if (newValue === this.config.maxValue) {
                    this.renderer.addClass(this.element.nativeElement.children[0].children[0], 'compact');
                } else {
                    this.renderer.removeClass(this.element.nativeElement.children[0].children[0], 'compact');
                }
                this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
                this.button.style.width = `${newValueButton}px`;

                this.lastValue = newValue;
                this.lastValueButton = newValueButton;
            });
        }
    }
}
export interface ScrollHideConfig {
    cssProperty: string;
    maxValue: number;
}