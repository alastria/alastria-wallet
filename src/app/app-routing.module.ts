import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// PAGES
import { ProfilePage } from './pages/profile/profile';
import { UserSettingsPage } from './components/user-info-header/userSettings/user-settings';
import { LoginPage } from './pages/login/login';
import { EntitiesPage } from './pages/entities/entities';
import { CameraPage } from './pages/tabsPage/camera/camera';
import { CredentialDetailPage } from './pages/credential-detail/credential-detail';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'entities', component: EntitiesPage,
    canActivate: [AuthGuardService] },
  { path: 'camera', component: CameraPage,
    canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfilePage,
    canActivate: [AuthGuardService] },
  { path: 'settings', component: UserSettingsPage,
    canActivate: [AuthGuardService] },
  { path: 'credential-detail', component: CredentialDetailPage,
    canActivate: [AuthGuardService] },
  { path: 'tabs',
    loadChildren: () => import('./pages/tabsPage/tabsPage.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuardService]
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
