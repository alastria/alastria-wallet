import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

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
