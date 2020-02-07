import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// COMPONENTS
import { EntitiesPage } from './entities';
import { ItemListComponent } from '../../components/item-list/item-list';

// MODULES
import { TabsModule } from '../../components/tabs/tabs.module';

// SERVICES
import { EntityService } from '../../services/entity.service';
import { CameraModule } from '../tabsPage/camera/camera.module';

@NgModule({
  declarations: [
    EntitiesPage,
    ItemListComponent
  ],
  imports: [
    IonicPageModule.forChild(EntitiesPage),
    TabsModule,
    CameraModule
  ],
  providers: [
    EntityService
  ]
})
export class EntitiesPageModule {}
