import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { parseCredentials } from '../../../utils';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

// Pages
import { LoginPage } from '../login/login';

// Services
import { SecuredStorageService } from '../../services/securedStorage.service';


@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html',
    styleUrls: ['/home.page.scss']
})
export class HomePage {

    isLoged: boolean;
    token: string;
    credentials: string;

    constructor(
        platform: Platform,
        private router: Router,
        private route: ActivatedRoute,
        private alertCtrl: AlertController,
        private securedStrg: SecuredStorageService,
        private deeplinks: Deeplinks
    ) {
        platform.ready().then(() => {
          this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras
                && this.router.getCurrentNavigation().extras.state) {
                this.token = this.router.getCurrentNavigation().extras.state.token;
            }
          });
          this.deeplinks.route({
              '/': LoginPage,
              '/login': LoginPage,
              '/createAI': LoginPage,
              '/createCredentials': LoginPage,
              '/createPresentations': LoginPage
          }).subscribe(
              (match) => {
                  const path = (match &&  match.$link) ? match.$link.path : null;

                  if (!this.isLoged) {
                      this.controlDeeplink(path, match.$args);
                  }
              },
              (noMatch) => {
                  console.log('No Match ', noMatch);
              }
          );
        });

    }

    async handleLogin(isLogged: boolean): Promise<any> {
        this.isLoged = isLogged;
        if (isLogged) {
            const did = await this.securedStrg.hasKey('userDID');
            if (did) {
              const navigationExtras: NavigationExtras = {
                state: {
                    token: this.token
                }
              };
              this.router.navigate(['/', 'tabs'], navigationExtras);
            } else {
                const navigationExtras: NavigationExtras = {
                  state: {
                      token: this.token
                  }
                };
                this.router.navigate(['/', 'entities'], navigationExtras);
            }
        }
    }

    private controlDeeplink(path: string, args: any) {
        switch (path) {
            case '/createAI':

                this.securedStrg.hasKey('userDID')
                    .then((DID) => {
                         if (!DID) {
                            this.token = args.alastriaToken;
                            const navigationExtras: NavigationExtras = {
                              state: {
                                  token: this.token
                              }
                            };
                            this.router.navigate(['/', 'home'], navigationExtras);
                        }
                    });
                break;
            case '/createCredentials':
                this.token = parseCredentials(args.credentials);

                if (this.isLoged) {
                    this.handleLogin(this.isLoged);
                }
                break;

            case '/login':
            case '/createPresentations':
                this.token = args.alastriaToken;

                if (this.isLoged) {
                    this.handleLogin(this.isLoged);
                }
                break;

            default:

                break;
        }
    }

}
