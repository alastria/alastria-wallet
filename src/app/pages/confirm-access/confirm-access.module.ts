import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// MODULES
import { SelectIdentityModule } from './select-identity/select-identity.module';
import { CommonModule } from '@angular/common';

// PAGES - COMPONENTS
import { ConfirmAccessPage } from './confirm-access';

// SERVICES
import { IdentityService } from '../../services/identity-service';
import { LoadingService } from '../../services/loading-service';
import { TransactionService } from '../../services/transaction-service';
import { TokenService } from '../../services/token-service';

@NgModule({
    declarations: [ConfirmAccessPage],
    imports: [
        SelectIdentityModule,
        CommonModule
    ],
    entryComponents: [
        ConfirmAccessPage,
    ],
    exports: [ConfirmAccessPage],
    providers: [
        LoadingService,
        IdentityService,
        TransactionService,
        TokenService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ConfirmAccessModule {}
