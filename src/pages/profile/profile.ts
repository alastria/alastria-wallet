import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailProfilePage } from '../detail-profile/detail-profile';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    /* TODO: Mokeo para eliminar en cuanto tengamos datos */
    data = [
        {
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
            }
            ]
        },
        {
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
            }
            ]
        },
        {
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
            }
            ]
        }
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    onStarClass(items: any, index: number, e: any) {
        for (var i = 0; i < items.length; i++) {
            items[i].isActive = i <= index;
        }
    }

    detail(item: any) {
        this.navCtrl.push(DetailProfilePage, { item });
    }
}
