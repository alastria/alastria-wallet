import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CredentialDetailPage } from './credential-detail';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CredentialDetailPage,
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    CredentialDetailPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DetailProfilePageModule {}
