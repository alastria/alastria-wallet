import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';
import { IonicPage } from 'ionic-angular/umd';

@IonicPage()
@Component({
  templateUrl: 'index.html',
  providers: [TabsService, ToastService]
})
export class Index {

  //@ViewChild('home') nav: NavController

  params: any = {};
  data: any = {};
  searchTerm: string = "Buscar";

  constructor(private toastCtrl: ToastService) {
    console.log("[Debug] Index enter");
    this.getList();
    this.setSearchBar();
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    this.params = changes['data'].currentValue;
  }

  onItemClick(item: any) {
    this.toastCtrl.presentToast("Folow");
  }

  getList() {
    this.params.data = {
      "items": [{
        "backgroundImage": "assets/images/alastria/index_1.jpg",
        "expandItems": [{
          "description": "00000000-X añadido el 31/12/2017",
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
          ],
          "reviews": "(nivel 3)",
          "title": "Documento Nacional de Identidad (DNI español)  "
        }, {
          "description": "c/ Pez, 1. 28010 Madrid",
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
          ],
          "reviews": "(nivel 2)",
          "title": "Dirección (vivienda)"
        }],
        "icon": "ios-arrow-dropright",
        "iconText": "Ver",
        "id": 1,
        "subtitle": "Tus datos más valiosos bajo control: tu dirección, tu fecha de nacimiento, tu email...",
        "title": "Datos básicos"
      }, {
        "backgroundImage": "assets/images/alastria/index_2.jpg",
        "expandItems": [{
          "description": "1 Dato compartido (12:45): Documento Nacional de Identidad (DNI Español)",
          "title": "Cinesa",
          "avatar": "assets/images/logo/logo-cinesa.png"
        },
        {
          "description": "Autenticación con AlastriaID (12:40) (Resultado Correcto)",
          "title": "Cinesa",
          "avatar": "assets/images/logo/logo-cinesa.png"
        }],
        "icon": "ios-arrow-dropright",
        "iconText": "Ver",
        "id": 2,
        "subtitle": "Revista toda tu actividad reciente relacionada con tu AlastriaID",
        "title": "Actividad reciente"
      }, {
        "backgroundImage": "assets/images/alastria/index_3.jpg",
        "expandItems": [{
          "description": "Accede a nuestros sistema de ayuda y consulta on-line para cualquier duda que tengas sobre Alastria.",
          "title": "Ayuda on-line"
        }],
        "icon": "ios-arrow-dropright",
        "iconText": "Ver",
        "id": 3,
        "subtitle": "Aprende cómo utilizar AlastriaID.",
        "title": "Ayuda"
      }]
    }

    this.params.events = {
      'onItemClick': function (item: any) {
        console.log('onItemClick');
      },
      'onRates': function (index: number) {
        console.log('onRates');
      },
      'onCheckBoxClick': function (item: any) {
        console.log('onCheckBoxClick');
      },
      'onButtonClick': function (item: any) {
        console.log('onButtonClick');
      }
    };

    this.params.dataHeader = {
        "headerTitle": "News List",
        "headerImage": "assets/images/background-small/0.jpg",
        "title": sessionStorage.getItem("loginName"),
        "subtitle": "Tu perfil",
        "expList" : {
          "data" : {
            "items": [{
              "backgroundImage": "assets/images/alastria/index_1.jpg",
              "expandItems": [{
                "description": "00000000-X añadido el 31/12/2017",
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
                ],
                "reviews": "(nivel 3)",
                "title": "Documento Nacional de Identidad (DNI español)  "
              }, {
                "description": "c/ Pez, 1. 28010 Madrid",
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
                ],
                "reviews": "(nivel 2)",
                "title": "Dirección (vivienda)"
              }],
              "icon": "ios-arrow-dropright",
              "iconText": "Ver",
              "id": 1,
              "subtitle": "Tus datos más valiosos bajo control: tu dirección, tu fecha de nacimiento, tu email...",
              "title": "Datos básicos"
            }, {
              "backgroundImage": "assets/images/alastria/index_2.jpg",
              "expandItems": [{
                "description": "1 Dato compartido (12:45): Documento Nacional de Identidad (DNI Español)",
                "title": "Cinesa",
                "avatar": "assets/images/logo/logo-cinesa.png"
              },
              {
                "description": "Autenticación con AlastriaID (12:40) (Resultado Correcto)",
                "title": "Cinesa",
                "avatar": "assets/images/logo/logo-cinesa.png"
              }],
              "icon": "ios-arrow-dropright",
              "iconText": "Ver",
              "id": 2,
              "subtitle": "Revista toda tu actividad reciente relacionada con tu AlastriaID",
              "title": "Actividad reciente"
            }, {
              "backgroundImage": "assets/images/alastria/index_3.jpg",
              "expandItems": [{
                "description": "Accede a nuestros sistema de ayuda y consulta on-line para cualquier duda que tengas sobre Alastria.",
                "title": "Ayuda on-line"
              }],
              "icon": "ios-arrow-dropright",
              "iconText": "Ver",
              "id": 3,
              "subtitle": "Aprende cómo utilizar AlastriaID.",
              "title": "Ayuda"
            }]
          },
          "events" : {
            'onItemClick': function (item: any) {
              console.log('onItemClick');
            },
            'onRates': function (index: number) {
              console.log('onRates');
            },
            'onCheckBoxClick': function (item: any) {
              console.log('onCheckBoxClick');
            },
            'onButtonClick': function (item: any) {
              console.log('onButtonClick');
            }
          }
        }
    }
  }

  setSearchBar() {
    this.data.headerTitle = "Inicio";
    this.data.title = "Inicio";
  }

  onEvent(event: string, item: any) {//ITEM [EVENT OR SELECTED ITEM]

    console.log(event);
  }
}
