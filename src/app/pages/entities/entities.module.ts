import { TokenService } from '../../services/token-service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { EntitiesPage } from './entities';
import { ItemListComponent } from '../../components/item-list/item-list';

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
    CommonModule,
    CameraModule
  ],
  entryComponents: [
    EntitiesPage,
  ],
  providers: [
    EntityService,
    MessageManagerService,
    TokenService,
    SocketService,
    InAppBrowser
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EntitiesPageModule {}
