import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EntityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationService {

  constructor(public http: HttpClient) {
  }

  async getNotifications(): Promise<any> {
    return this.http.get('../assets/mocks/notifications.json').toPromise();
  }

}
