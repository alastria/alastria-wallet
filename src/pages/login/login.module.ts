import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Login } from './login';
import { Camera } from '../camera/camera';

@NgModule({
    declarations: [
        Login,
    ],
    imports: [
        IonicPageModule.forChild(Login),
    ],
    exports: [
        Login
    ],
    entryComponents:[
        Camera
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginModule { }
