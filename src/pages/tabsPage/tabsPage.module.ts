
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// PAGES
import { TabsPage } from './tabsPage';

// MODULES
import { TabsModule } from '../../components/tabs/tabs.module';
import { IndexModule } from './index/index.module';
import { CameraModule } from './camera/camera.module';
import { OptionsModule } from './options/options.module';
import { ActivityModule } from './activity/activity.module';
import { NotificationModule } from './notification/notification.module';
import { ContructionsPageModule } from './../contructions/contructions.module';

@NgModule({
    declarations: [
        TabsPage
    ],
    imports: [
        IonicPageModule.forChild(TabsPage),
        TabsModule,
        ContructionsPageModule,
        IndexModule,
        NotificationModule,
        ActivityModule,
        OptionsModule,
        CameraModule
    ],
    exports: [
        TabsPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsPageModule { }
