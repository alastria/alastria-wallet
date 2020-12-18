import { SecuredStorageService } from './securedStorage.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private securedStrg: SecuredStorageService,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.securedStrg.get('isLogged').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }


  login(key: any) {
    return this.securedStrg.isAuthorized(key).then((isAuthorized: boolean) => {
      this.authState.next(isAuthorized);

      return isAuthorized;
    });
  }

  logout() {
    this.securedStrg.remove('isLogged').then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  isAuthenticated() {

    return this.authState.value;
  }
}
