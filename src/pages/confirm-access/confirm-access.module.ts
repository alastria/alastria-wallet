import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ConfirmAccess } from './confirm-access';
@NgModule({
	declarations: [ConfirmAccess],
	imports: [
		IonicPageModule.forChild(ConfirmAccess),
	],
	exports: [ConfirmAccess]
})
export class ConfirmAccessModule {}
