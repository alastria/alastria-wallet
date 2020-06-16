
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// PAGES
import { TabsPage } from './tabsPage';

// MODULES
import { IndexModule } from './index/index.module';
import { CameraModule } from './camera/camera.module';
import { OptionsModule } from './options/options.module';
import { ActivityModule } from './activity/activity.module';
import { NotificationModule } from './notification/notification.module';
import { ConstructionsPageModule } from '../constructions/constructions.module';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ScrollHideDirective } from 'src/app/components/parallax/parallax.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TabsPageRoutingModule,
        ConstructionsPageModule,
        IndexModule,
        NotificationModule,
        ActivityModule,
        OptionsModule,
        CameraModule
    ],
    declarations: [
        TabsPage,
        ScrollHideDirective
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
