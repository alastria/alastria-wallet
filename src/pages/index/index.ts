import { Component, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';
import { IonicPage, NavController } from 'ionic-angular/umd';

@IonicPage()
@Component({
  templateUrl: 'index.html',
  providers: [TabsService, ToastService]
})
export class Index {

  //@ViewChild('home') nav: NavController

  params: any = {};
  data: any = {};
  searchTerm: string = "";

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
      "items" : [ {
        "backgroundImage" : "assets/images/alastria/index_1.jpg",
        "expandItems" : {
          "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
          "iconsStars" : [ {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : false
          } ],
          "reviews" : "4.12 (78 reviews)",
          "title" : "Lorem ipsum dolor sit amet"
        },
        "icon" : "ios-arrow-dropright",
        "iconText" : "Read more",
        "id" : 1,
        "subtitle" : "Tus datos más valiosos bajo control",
        "title" : "Datos básicos"
      }, {
        "backgroundImage" : "assets/images/alastria/index_2.jpg",
        "expandItems" : {
          "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
          "iconsStars" : [ {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : false
          } ],
          "reviews" : "4.12 (78 reviews)",
          "title" : "Lorem ipsum dolor sit amet"
        },
        "icon" : "ios-arrow-dropright",
        "iconText" : "Read more",
        "id" : 2,
        "subtitle" : "Lorem ipsum dolor sit amet",
        "title" : "Seguridad"
      }, {
        "backgroundImage" : "assets/images/alastria/index_3.jpg",
        "expandItems" : {
          "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
          "iconsStars" : [ {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : true
          }, {
            "iconActive" : "icon-star",
            "iconInactive" : "icon-star-outline",
            "isActive" : false
          } ],
          "reviews" : "4.12 (78 reviews)",
          "title" : "Lorem ipsum dolor sit amet"
        },
        "icon" : "ios-arrow-dropright",
        "iconText" : "Read more",
        "id" : 3,
        "subtitle" : "Lorem ipsum dolor sit amet",
        "title" : "Ayuda"
      }]
    }

    this.params.events = {
      'onItemClick': function(item: any) {
         console.log('onItemClick');
      },
      'onRates': function(index: number) {
          console.log('onRates');
      },
      'onCheckBoxClick': function(item: any) {
          console.log('onCheckBoxClick');
      },
      'onButtonClick' : function(item: any) {
         console.log('onButtonClick');
      }
    };
  }

  setSearchBar(){
    this.data.headerTitle = "Inicio";
    this.data.title = "Inicio";
  }

  onEvent(event: string, item: any) {//ITEM [EVENT OR SELECTED ITEM]
    
    console.log(event);
  }
}
