import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// PAGES
import { ProfilePage } from '../profile/profile';
import { UserSettingsPage } from '../../components/user-info-header/userSettings/user-settings';
import { HomePage } from './home.page';
import { LoginPage } from '../login/login';
import { EntitiesPage } from '../entities/entities';
import { CameraPage } from '../tabsPage/camera/camera';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  { path: 'login', component: LoginPage },
  { path: 'entities', component: EntitiesPage },
  { path: 'camera', component: CameraPage },
  { path: 'profile', component: ProfilePage },
  { path: 'settings', component: UserSettingsPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
