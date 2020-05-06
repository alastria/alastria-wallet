import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// PAGES
import { TabsPage } from '../tabsPage/tabsPage';
import { ProfilePage } from '../profile/profile';
import { UserSettingsPage } from '../../components/user-info-header/userSettings/user-settings';
import { HomePage } from './home.page';
import { LoginPage } from '../login/login';
import { EntitiesPage } from '../entities/entities';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  { path: 'login', component: LoginPage },
  { path: 'entities', component: EntitiesPage },
  // {
  //   path: 'tabs',
  //   component: TabsPage,
  //   children: [
  //     {
  //       path: 'index',
  //       loadChildren: './pages/tabsPage/index/index.module#IndexModule'
  //     },
  //     {
  //       path: 'activity',
  //       loadChildren: './pages/tabsPage/activity/activity.module#ActivityModule'
  //     },
  //     {
  //       path: 'camera',
  //       loadChildren: './pages/tabsPage/camera/camera.module#CameraModule'
  //     },
  //     {
  //       path: 'notification',
  //       loadChildren: './pages/tabsPage/notification/notification.module#NotificationModule'
  //     },
  //     {
  //       path: 'options',
  //       loadChildren: './pages/tabsPage/options/options.module#OptionsModule'
  //     }
  //   ],
  // },
  { path: 'profile', component: ProfilePage },
  { path: 'settings', component: UserSettingsPage },
];
// const routes: Routes = [
//   {
//     path: '',
//     component: HomePage,
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
