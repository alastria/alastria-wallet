import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

// MODULES
import { SelectIdentityModule } from './select-identity/select-identity.module';

// PAGES - COMPONENTS
import { ConfirmAccess } from './confirm-access';

// SERVICES
import { IdentityService } from './../../services/identity-service';
import { LoadingService } from './../../services/loading-service';
import { TransactionService } from '../../services/transaction-service';
import { TokenService } from './../../services/token-service';

@NgModule({
	declarations: [ConfirmAccess],
	imports: [
		IonicPageModule.forChild(ConfirmAccess),
		SelectIdentityModule
	],
	exports: [ConfirmAccess],
	providers: [
		LoadingService,
		IdentityService,
		TransactionService,
		TokenService
	]
})
export class ConfirmAccessModule {}
