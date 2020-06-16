import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

// PAGES - COMPONENTS
import { SelectIdentity } from './select-identity';

// MODULES
import { IdentityDataListModule } from '../../../components/identity-data-list/identity-data-list.module';

@NgModule({
	declarations: [SelectIdentity],
	imports: [
		IonicPageModule.forChild(SelectIdentity),
		IdentityDataListModule
	],
	exports: [
		SelectIdentity,
		IdentityDataListModule
	]
})
export class SelectIdentityModule {}
