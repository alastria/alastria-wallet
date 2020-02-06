import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// COMPONENTS
import { EntitiesPage } from './entities';
import { ItemListComponent } from '../../components/item-list/item-list';

// MODULES
import { TabsModule } from '../../components/tabs/tabs.module';

// SERVICES
import { EntityService } from '../../services/entity.service';

@NgModule({
  declarations: [
    EntitiesPage,
    ItemListComponent
  ],
  imports: [
    IonicPageModule.forChild(EntitiesPage),
    TabsModule
  ],
  providers: [
    EntityService
  ]
})
export class EntitiesPageModule {}
