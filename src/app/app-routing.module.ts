import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// PAGES
import { ProfilePage } from './pages/profile/profile';
import { UserSettingsPage } from './components/user-info-header/userSettings/user-settings';
import { LoginPage } from './pages/login/login';
import { EntitiesPage } from './pages/entities/entities';
import { CameraPage } from './pages/tabsPage/camera/camera';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'entities', component: EntitiesPage },
  { path: 'camera', component: CameraPage },
  { path: 'profile', component: ProfilePage },
  { path: 'settings', component: UserSettingsPage },{
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  { path: 'tabs',
    loadChildren: () => import('./pages/tabsPage/tabsPage.module').then( m => m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
