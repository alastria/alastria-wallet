import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'credential-detail-page',
  templateUrl: 'credential-detail.html',
})
export class CredentialDetailPage implements OnInit {

    data: any;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.data = this.activatedRoute.snapshot.paramMap.get('item');
  }

}
