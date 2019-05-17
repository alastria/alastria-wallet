import { DetailProfilePage } from './../../pages/detail-profile/detail-profile';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

/**
 * Generated class for the IdentityDataListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'identity-data-list',
  templateUrl: 'identity-data-list.html'
})
export class IdentityDataListComponent {
  @Input() isSelectable = false;

  @Output() handleIdentitySelect: EventEmitter<any> = new EventEmitter();

  /* TODO: Mokeo para eliminar en cuanto tengamos datos */
  identityData = [
    {
      id: 1,
      titleP: 'Carnet de estudiante',
      emitter: 'Emisor del testimonio',
      place: 'Universitat de Barcelona',
      valueT: 'Valor',
      value: 'Máster en Astropología, Física de partículas y Cosmología',
      addDateT: 'Fecha incorporación del testimonio',
      addDate: '01/11/2018 13:40h',
      endDateT: 'Fecha fin de vigencia',
      endDate: '01/03/2021',
      levelT: 'Nivel de aseguramiento',
      level: 'Nivel 2',
      "iconsStars": [{
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": false
        }]
    },
    {
      id: 2,
      titleP: 'Estudios finalizados',
      emitter: 'Emisor del testimonio',
      place: 'Universitat de Barcelona',
      valueT: 'Valor',
      value: 'Grado en Física',
      addDateT: 'Fecha incorporación del testimonio',
      addDate: '',
      endDateT: 'Fecha fin de vigencia',
      endDate: '01/03/2021',
      level: 'Nivel 3',
      "iconsStars": [{
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }]
    },
    {
      id: 3,
      titleP: 'Domicilio postal',
      emitter: 'Emisor del testimonio',
      place: 'Ayunt. de Castelldlefels',
      valueT: 'Valor',
      value: 'Rambla de la Vila 5, 4-3',
      addDateT: 'Fecha incorporación del testimonio',
      addDate: '',
      endDateT: 'Fecha fin de vigencia',
      endDate: '01/03/2021',
      level: 'Nivel 3',
      "iconsStars": [{
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }, {
          "iconActive": "icon-star",
          "iconInactive": "icon-star-outline",
          "isActive": true
      }]
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onStarClass(items: any, index: number, e: any): void {
    for (var i = 0; i < items.length; i++) {
      items[i].isActive = i <= index;
    }
  }

  /**
   * Go detail item page
   * @param {*} item - identity item
   */
  detail(item: any): void {
    this.navCtrl.push(DetailProfilePage, { item });
  }
  
  /**
   * Function that emit event when change checkbox
   * @param {*} event - event object for show if checked
   * @param {number} id - id of identity item
   */
  changeIdentitySelect(event: any, id: number): void {
    const result: any = {
      id,
      value: event.checked
    }

    this.handleIdentitySelect.emit(result);
  }

}
