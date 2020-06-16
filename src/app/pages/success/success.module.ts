import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessPage } from './success';

@NgModule({
  declarations: [
    SuccessPage,
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    SuccessPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SuccessPageModule {}
