import { TokenService } from './../../services/token-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// COMPONENTS
import { EntitiesPage } from './entities';
import { ItemListComponent } from '../../components/item-list/item-list';

// MODULES
import { TabsModule } from '../../components/tabs/tabs.module';

// SERVICES
import { EntityService } from '../../services/entity.service';
import { CameraModule } from '../tabsPage/camera/camera.module';
import { MessageManagerService } from '../../services/messageManager-service';
import { SocketService } from '../../services/socket.service';

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
    EntityService,
    MessageManagerService,
    TokenService,
    SocketService,
    InAppBrowser
  ]
})
export class EntitiesPageModule {}
