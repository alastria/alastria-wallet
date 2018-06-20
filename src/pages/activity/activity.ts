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
        "title": "Cinesa",
        "subtitle": "1 Dato compartido",
        "follow": "Info",
        "avatar": "assets/images/logo/logo-cinesa.png"
      },
      {
        "title": "Cinesa",
        "subtitle": "Autentificación con AlastriaID",
        "follow": "Info",
        "avatar": "assets/images/logo/logo-cinesa.png"
      }
    ]
  }

  setSearchBar(){
    this.data.headerTitle = "Actividad";
    this.data.title = "Actividad";
  }
}
