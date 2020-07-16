import { TokenService } from '../../../services/token-service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';

// PAGES
import { CameraPage } from './camera';

// SERVICES
import { MessageManagerService } from '../../../services/messageManager-service';

@NgModule({
    declarations: [
        CameraPage,
    ],
    imports: [
        CommonModule,
        NgxQRCodeModule
    ],
    entryComponents: [
        CameraPage,
    ],
    exports: [
        CameraPage
    ],
    providers: [
        MessageManagerService,
        TokenService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class CameraModule { }
