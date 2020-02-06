import { Component, Input } from '@angular/core';
import { Item } from '../../models/item.model';

/**
 * Generated class for the ItemListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-list',
  templateUrl: 'item-list.html'
})
export class ItemListComponent {

  @Input() items: Array<Item>;

  constructor() {
  }

  selectItem(item: Item) {
    console.log('Item ', item);
  }

}
