import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConstructionsPage } from './constructions';

@NgModule({
  declarations: [
    ConstructionsPage
  ],
  entryComponents: [
    ConstructionsPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConstructionsPageModule {}
