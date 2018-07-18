import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
