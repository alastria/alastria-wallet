import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-detail-profile',
  templateUrl: 'detail-profile.html',
})
export class DetailProfilePage {

    data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.data = this.navParams.get('item');
    console.log('Curro2 -->', this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailProfilePage');
  }

}
