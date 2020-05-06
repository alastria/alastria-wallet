
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// PAGES
import { TabsPage } from './tabsPage';

// MODULES
import { TabsModule } from '../../components/tabs/tabs.module';
import { IndexModule } from './index/index.module';
import { CameraModule } from './camera/camera.module';
import { OptionsModule } from './options/options.module';
import { ActivityModule } from './activity/activity.module';
import { NotificationModule } from './notification/notification.module';
import { ConstructionsPageModule } from '../constructions/constructions.module';

@NgModule({
    declarations: [
        TabsPage
    ],
    imports: [
        TabsModule,
        ConstructionsPageModule,
        IndexModule,
        NotificationModule,
        ActivityModule,
        OptionsModule,
        CameraModule
    ],
    entryComponents: [
        TabsPage
    ],
    exports: [
        TabsPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsPageModule { }
