import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabsPage';
import { IndexPage } from './index';
import { ActivityPage } from './activity/activity';
import { CameraPage } from './camera/camera';
import { NotificationPage } from './notification/notification';
import { OptionsPage } from './options/options';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:
      [
        {
          path: 'index',
          component: IndexPage
        },
        {
          path: 'activity',
          component: ActivityPage
        },
        {
          path: 'camera',
          component: CameraPage
        },
        {
          path: 'notification',
          component: NotificationPage
        },
        {
          path: 'options',
          component: OptionsPage
        },
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/index',
    pathMatch: 'full'
  },
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule {}
