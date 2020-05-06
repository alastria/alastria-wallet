import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../models/item.model';

/**
 * Generated class for the ItemListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-list',
  templateUrl: 'item-list.html',
  styleUrls: ['/item-list.scss']
})
export class ItemListComponent {

  @Input() items: Array<Item>;
  @Output() handleSelectItem = new EventEmitter<any>();

  constructor() {
  }

  selectItem(item: Item) {
    this.handleSelectItem.emit(item);
  }

}
