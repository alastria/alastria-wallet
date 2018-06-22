import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeader } from './elastic-header';

@NgModule({
    declarations: [
        ElasticHeader,
    ],
    exports: [
        ElasticHeader
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ElasticHeaderModule { }
