import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'credential-detail-page',
  templateUrl: 'credential-detail.html',
})
export class CredentialDetailPage {

    data: any;

  constructor(public navParams: NavParams) {
  }

  ngOnInit(){
    this.data = this.navParams.get('item');
  }

}
