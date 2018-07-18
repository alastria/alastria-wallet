import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterForm } from './register-form';

@NgModule({
    declarations: [
        RegisterForm
    ],
    imports: [
        IonicPageModule.forChild(RegisterForm),
    ],
    exports: [
        RegisterForm
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterFormModule { }
