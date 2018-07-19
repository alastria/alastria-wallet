import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from './camera';
import { NgxQRCodeModule } from '../../../../node_modules/ngx-qrcode2';

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
    ]
})

export class CameraModule { }
