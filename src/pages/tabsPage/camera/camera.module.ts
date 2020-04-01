import { TokenService } from './../../../services/token-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxQRCodeModule } from '../../../../node_modules/ngx-qrcode2';

// PAGES
import { Camera } from './camera';

// SERVICES
import { MessageManagerService } from './../../../services/messageManager-service';

@NgModule({
    declarations: [
        Camera,
    ],
    imports: [
        IonicPageModule.forChild(Camera),
        NgxQRCodeModule
    ],
    exports:[
        Camera
    ],
    providers: [
        MessageManagerService,
        TokenService
    ]
})

export class CameraModule { }
