import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';

@IonicPage()
@Component({
  templateUrl: 'index.html',
  providers: [TabsService, ToastService]
})
export class Index {

  params: any = {};

  constructor(private tabsService: TabsService, private toastCtrl: ToastService) {
    this.tabsService.load("tab1").subscribe(snapshot => {
      this.params = snapshot;
    });
    this.getList();
    
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
        "backgroundImage" : "assets/images/background/1.jpg",
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
        "subtitle" : "Monday, 15th Oct. 2017",
        "title" : "Main Stage Event"
      }, {
        "backgroundImage" : "assets/images/background/2.jpg",
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
        "subtitle" : "Wendsday, 21st Oct. 2017",
        "title" : "Free Ride"
      }, {
        "backgroundImage" : "assets/images/background/0.jpg",
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
        "subtitle" : "Wednesday, July 05, 1983",
        "title" : "Mountain Tour"
      }, {
        "backgroundImage" : "assets/images/background/5.jpg",
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
        "id" : 4,
        "subtitle" : "Sunday, October 08, 1921",
        "title" : "Sea Tour"
      }, {
        "backgroundImage" : "assets/images/background/6.jpg",
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
        "id" : 5,
        "subtitle" : "Monday, June 26, 1949",
        "title" : "Bridge Tour"
      }, {
        "backgroundImage" : "assets/images/background/7.jpg",
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
        "id" : 6,
        "subtitle" : "Thursday, May 19, 1992",
        "title" : "Open Air Concert"
      } ]
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
}
