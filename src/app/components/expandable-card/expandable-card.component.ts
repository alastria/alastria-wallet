import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-expandable-card',
  templateUrl: './expandable-card.component.html',
  styleUrls: ['./expandable-card.component.scss'],
})
export class ExpandableCardComponent implements AfterViewInit {
  @ViewChild('expandWrapper', { read: ElementRef, static: false }) expandWrapper: ElementRef;
  @Input() expanded = false;
  @Input() expandHeight = '150px';

  constructor(public renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, 'max-height', this.expandHeight);
  }

}
