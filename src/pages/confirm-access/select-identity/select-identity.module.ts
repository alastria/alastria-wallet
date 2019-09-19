import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SelectIdentity } from './select-identity';
@NgModule({
	declarations: [SelectIdentity],
	imports: [
		IonicPageModule.forChild(SelectIdentity),
	],
	exports: [SelectIdentity]
})
export class ConfirmAccessModule {}
