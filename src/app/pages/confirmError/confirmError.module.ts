import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmErrorPage } from './confirmError';

@NgModule({
  declarations: [
    ConfirmErrorPage,
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    ConfirmErrorPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ConfirmErrorModule {}
