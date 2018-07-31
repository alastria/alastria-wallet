import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ElasticHeader } from './elastic-header';
import { UserInfoHeaderModule } from '../user-info-header/user-info-header.module';

@NgModule({
    declarations: [
        ElasticHeader,
    ],
    exports: [
        ElasticHeader,
        UserInfoHeaderModule

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ElasticHeaderModule { }
