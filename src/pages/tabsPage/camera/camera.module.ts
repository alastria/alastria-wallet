import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from './camera';

@NgModule({
    declarations: [
        Camera,
    ],
    imports: [
        IonicPageModule.forChild(Camera),
    ],
    exports:[
        Camera
    ]
})

export class ActivityModule { }
