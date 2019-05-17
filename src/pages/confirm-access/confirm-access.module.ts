import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ConfirmAccessComponent } from './confirm-access';
@NgModule({
	declarations: [ConfirmAccessComponent],
	imports: [
		IonicPageModule.forChild(ConfirmAccessComponent),
	],
	exports: [ConfirmAccessComponent]
})
export class ConfirmAccessModule {}
