import { EntitiesPage } from './pages/entities/entities';
import { LoginPage } from './pages/login/login';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// PAGES
import { UserSettingsPage } from './components/user-info-header/userSettings/user-settings';
import { ProfilePage } from './pages/profile/profile';
import { TabsPage } from './pages/tabsPage/tabsPage';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
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
