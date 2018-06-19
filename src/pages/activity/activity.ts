import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';

@IonicPage()
@Component({
  templateUrl: 'activity.html',
  providers: [TabsService, ToastService]
})
export class Activity {

  params: any = {};
  data: any = {};
  searchTerm: string = "";

  constructor(private toastCtrl: ToastService) {
    this.getList();
    this.setSearchBar();
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    this.params = changes['data'].currentValue;
  }

  onItemClick(item: any) {
    this.toastCtrl.presentToast("Folow");
  }

  onEvent(event: string, item: any) {//ITEM [EVENT OR SELECTED ITEM]
    
    console.log(event);
  }

  getList() {
    this.params.items = [
      {
        "title": "Rachel	McGrath",
        "subtitle": "@rachel.mcgrath",
        "follow": "follow",
        "avatar": "assets/images/avatar/1.jpg"
      },
      {
        "title": "Claire	Johnston",
        "subtitle": "@claire.johnston",
        "follow": "follow",
        "avatar": "assets/images/avatar/2.jpg"
      },
      {
        "title": "Ella	Chapman",
        "subtitle": "@ella.chapman",
        "follow": "follow",
        "avatar": "assets/images/avatar/3.jpg"
      },
      {
        "title": "Una	Davies",
        "subtitle": "@una.davies",
        "follow": "follow",
        "avatar": "assets/images/avatar/4.jpg"
      },
      {
        "title": "Natalie	Forsyth",
        "subtitle": "@natalie.forsyth",
        "follow": "follow",
        "avatar": "assets/images/avatar/6.jpg"
      },
      {
        "title": "Deirdre	Bond",
        "subtitle": "@deirdre.bond",
        "follow": "follow",
        "avatar": "assets/images/avatar/5.jpg"
      },
      {
        "title": "Claire	Metcalfe",
        "subtitle": "@claire.metcalfe",
        "follow": "follow",
        "avatar": "assets/images/avatar/7.jpg"
      }
    ]
  }

  setSearchBar(){
    this.data.headerTitle = "Actividad";
    this.data.title = "Actividad";
  }
}
